import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { 
  Bold, Italic, Underline, Link, Palette, 
  Plus, Check
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

const fontSizes = [
  { value: '12', label: '12px' },
  { value: '14', label: '14px' },
  { value: '16', label: '16px' },
  { value: '18', label: '18px' },
  { value: '20', label: '20px' },
  { value: '24', label: '24px' },
  { value: '28', label: '28px' },
  { value: '32', label: '32px' }
];

const presetColors = [
  '#000000', '#374151', '#6B7280', '#9CA3AF',
  '#2563eb', '#3b82f6', '#dc2626', '#ef4444',
  '#059669', '#10b981', '#d97706', '#f59e0b',
  '#7c2d12', '#7c3aed', '#8b5cf6', '#db2777'
];

const emojis = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
  '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
  '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
  '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
  '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙',
  '✨', '⭐', '🌟', '💫', '🔥', '💯', '🎉', '🎊',
  '🚀', '💡', '🎯', '🏆', '🎨', '📝', '💻', '📱'
];

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Digite seu texto...", 
  maxLength = 500,
  className = ""
}: RichTextEditorProps) {
  const [content, setContent] = useState('');
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false
  });
  
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  
  const [customColor, setCustomColor] = useState('#000000');
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  
  const editorRef = useRef<HTMLDivElement>(null);

  // Converter markdown para HTML para exibição inicial
  const markdownToHtml = useCallback((markdown: string) => {
    if (!markdown) return '';
    
    let html = markdown;
    
    // Preservar spans com estilos primeiro
    const spanMatches = html.match(/<span[^>]*style="[^"]*"[^>]*>.*?<\/span>/gi) || [];
    const spanPlaceholders: { [key: string]: string } = {};
    
    spanMatches.forEach((span, index) => {
      const placeholder = `__SPAN_PLACEHOLDER_${index}__`;
      spanPlaceholders[placeholder] = span;
      html = html.replace(span, placeholder);
    });
    
    // Converter **negrito** para <strong>
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Converter *itálico* para <em>
    html = html.replace(/(?<!\*)\*(?!\*)([^*]+)\*/g, '<em>$1</em>');
    // Converter <u>sublinhado</u> para <u>
    html = html.replace(/<u>(.*?)<\/u>/g, '<u>$1</u>');
    // Converter [texto](url) para <a>
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    // Converter quebras de linha
    html = html.replace(/\n/g, '<br>');
    
    // Restaurar spans preservados
    Object.keys(spanPlaceholders).forEach(placeholder => {
      html = html.replace(placeholder, spanPlaceholders[placeholder]);
    });
    
    return html;
  }, []);

  // Converter HTML para markdown para salvar
  const htmlToMarkdown = useCallback((html: string) => {
    if (!html) return '';
    
    let markdown = html;
    
    // Preservar spans com style primeiro (mais específico)
    markdown = markdown.replace(/<span([^>]*style="[^"]*"[^>]*)>(.*?)<\/span>/gi, '<span$1>$2</span>');
    
    // Converter formatação dentro de spans estilizados
    markdown = markdown.replace(/<strong[^>]*>(<span[^>]*style="[^"]*"[^>]*>.*?<\/span>)<\/strong>/gi, '**$1**');
    markdown = markdown.replace(/<em[^>]*>(<span[^>]*style="[^"]*"[^>]*>.*?<\/span>)<\/em>/gi, '*$1*');
    markdown = markdown.replace(/<u[^>]*>(<span[^>]*style="[^"]*"[^>]*>.*?<\/span>)<\/u>/gi, '<u>$1</u>');
    
    // Converter <strong> para **negrito**
    markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    // Converter <b> para **negrito**
    markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
    // Converter <em> para *itálico*
    markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
    // Converter <i> para *itálico*
    markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
    // Converter <u> para <u>sublinhado</u>
    markdown = markdown.replace(/<u[^>]*>(.*?)<\/u>/gi, '<u>$1</u>');
    // Converter <a> para [texto](url)
    markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
    // Converter <br> para quebras de linha
    markdown = markdown.replace(/<br\s*\/?>/gi, '\n');
    // Remover outras tags HTML (exceto spans com style)
    markdown = markdown.replace(/<(?!span[^>]*style)[^>]*>/gi, '');
    // Decodificar entidades HTML
    markdown = markdown.replace(/&nbsp;/g, ' ');
    markdown = markdown.replace(/&lt;/g, '<');
    markdown = markdown.replace(/&gt;/g, '>');
    markdown = markdown.replace(/&amp;/g, '&');
    
    return markdown.trim();
  }, []);

  // Sincronizar com valor inicial
  useEffect(() => {
    if (value !== content) {
      setContent(value);
      if (editorRef.current) {
        // Renderizar HTML diretamente se já contém tags HTML, senão renderizar como markdown
        if (value.includes('<') || value.includes('[')) {
          editorRef.current.innerHTML = value;
        } else {
          editorRef.current.innerHTML = markdownToHtml(value);
        }
      }
    }
  }, [value, content, markdownToHtml]);

  // Obter texto atual do editor
  const getCurrentText = useCallback(() => {
    return editorRef.current?.textContent || '';
  }, []);

  // Detectar formatação ativa
  const updateActiveFormats = useCallback(() => {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline')
    });
  }, []);

  // Aplicar formatação preservando tamanho da fonte
  const applyFormat = useCallback((command: string) => {
    document.execCommand(command, false);
    updateActiveFormats();
    
    if (editorRef.current) {
      const newHtml = editorRef.current.innerHTML;
      setContent(newHtml);
      onChange(newHtml);
    }
  }, [updateActiveFormats, onChange]);

  // Aplicar tamanho da fonte
  const applyFontSize = useCallback((size: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    const span = document.createElement('span');
    span.style.fontSize = `${size}px`;
    
    try {
      range.surroundContents(span);
      selection.removeAllRanges();
      
      if (editorRef.current) {
        const newHtml = editorRef.current.innerHTML;
        setContent(newHtml);
        onChange(newHtml);
      }
    } catch (e) {
      // Se não conseguir aplicar, tenta de outra forma
      document.execCommand('fontSize', false, '7');
      const fontElements = editorRef.current?.querySelectorAll('font[size="7"]');
      fontElements?.forEach(el => {
        const span = document.createElement('span');
        span.style.fontSize = `${size}px`;
        span.innerHTML = el.innerHTML;
        el.parentNode?.replaceChild(span, el);
      });
      
      if (editorRef.current) {
        const newHtml = editorRef.current.innerHTML;
        setContent(newHtml);
        onChange(newHtml);
      }
    }
  }, [onChange]);

  // Aplicar cor
  const applyColor = useCallback((color: string) => {
    document.execCommand('foreColor', false, color);
    
    if (editorRef.current) {
      const newHtml = editorRef.current.innerHTML;
      setContent(newHtml);
      onChange(newHtml);
    }

    setShowColorPicker(false);
    setShowColorModal(false);
  }, [onChange]);

  // Inserir emoji
  const insertEmoji = useCallback((emoji: string) => {
    document.execCommand('insertText', false, emoji);
    
    if (editorRef.current) {
      const newHtml = editorRef.current.innerHTML;
      setContent(newHtml);
      onChange(newHtml);
    }

    setShowEmojiPicker(false);
  }, [onChange]);

  // Inserir link
  const insertLink = useCallback(() => {
    if (!linkText || !linkUrl) return;

    // Garantir que o editor tenha foco
    if (editorRef.current) {
      editorRef.current.focus();
      
      const selection = window.getSelection();
      if (selection) {
        // Se não há seleção, criar uma no final do conteúdo
        if (selection.rangeCount === 0) {
          const range = document.createRange();
          range.selectNodeContents(editorRef.current);
          range.collapse(false); // Colapsar no final
          selection.addRange(range);
        }
        
        const range = selection.getRangeAt(0);
        
        // Criar o elemento do link
        const link = document.createElement('a');
        link.href = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
        link.textContent = linkText;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        // Inserir o link
        range.deleteContents();
        range.insertNode(link);
        
        // Mover o cursor para depois do link
        range.setStartAfter(link);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Atualizar o conteúdo
        const newHtml = editorRef.current.innerHTML;
        setContent(newHtml);
        onChange(newHtml);
      }
    }

    setLinkText('');
    setLinkUrl('');
    setShowLinkDialog(false);
  }, [linkText, linkUrl, onChange]);

  // Manipular input do editor
  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    
    const currentText = getCurrentText();
    
    // Verificar limite de caracteres
    if (currentText.length > maxLength) {
      // Reverter se exceder o limite
      return;
    }
    
    const newHtml = editorRef.current.innerHTML;
    setContent(newHtml);
    // Salva HTML diretamente ao invés de converter para markdown
    onChange(newHtml);
    updateActiveFormats();
  }, [getCurrentText, maxLength, onChange, updateActiveFormats]);

  // Manipular eventos de seleção
  const handleSelectionChange = useCallback(() => {
    updateActiveFormats();
  }, [updateActiveFormats]);

  const currentLength = getCurrentText().length;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Barra de ferramentas minimalista */}
      <div className="flex items-center gap-2">
        {/* Font size */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 rounded-full bg-muted/40 hover:bg-muted border border-border/50"
              title="Tamanho da fonte"
            >
              <span className="text-sm font-medium text-foreground">Aa</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" align="start" side="top">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Tamanho da Fonte</Label>
              <div className="grid grid-cols-4 gap-2">
                {fontSizes.map((size) => (
                  <Button
                    key={size.value}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs justify-center"
                    onClick={() => applyFontSize(size.value)}
                  >
                    <span style={{ fontSize: `${Math.min(parseInt(size.value), 14)}px` }}>
                      {size.label}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Bold */}
        <Button
          type="button"
          variant={activeFormats.bold ? "default" : "ghost"}
          size="sm"
          className="h-10 w-10 p-0 rounded-full bg-muted/40 hover:bg-muted border border-border/50 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          onClick={() => applyFormat('bold')}
          title="Negrito"
          data-state={activeFormats.bold ? "on" : "off"}
        >
          <Bold className="w-4 h-4" />
        </Button>

        {/* Italic */}
        <Button
          type="button"
          variant={activeFormats.italic ? "default" : "ghost"}
          size="sm"
          className="h-10 w-10 p-0 rounded-full bg-muted/40 hover:bg-muted border border-border/50 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          onClick={() => applyFormat('italic')}
          title="Itálico"
          data-state={activeFormats.italic ? "on" : "off"}
        >
          <Italic className="w-4 h-4" />
        </Button>

        {/* Underline */}
        <Button
          type="button"
          variant={activeFormats.underline ? "default" : "ghost"}
          size="sm"
          className="h-10 w-10 p-0 rounded-full bg-muted/40 hover:bg-muted border border-border/50 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          onClick={() => applyFormat('underline')}
          title="Sublinhado"
          data-state={activeFormats.underline ? "on" : "off"}
        >
          <Underline className="w-4 h-4" />
        </Button>

        {/* Colors */}


        {/* Emoji picker */}
        <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 rounded-full bg-muted/40 hover:bg-muted border border-border/50"
              title="Inserir emoji"
            >
              <span className="text-base">😊</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" align="start" side="top">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Emojis</Label>
              <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto scrollbar-light">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    className="h-8 w-8 hover:bg-muted rounded flex items-center justify-center text-base transition-colors"
                    onClick={() => insertEmoji(emoji)}
                    title={emoji}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Link */}
        <Popover 
          open={showLinkDialog} 
          onOpenChange={(open) => {
            setShowLinkDialog(open);
            if (!open) {
              // Limpar campos quando fechar sem inserir
              setLinkText('');
              setLinkUrl('');
            }
          }}
        >
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 rounded-full bg-muted/40 hover:bg-muted border border-border/50"
              title="Inserir link"
              onClick={() => {
                // Garantir que o editor tenha foco ao abrir o dialog
                if (editorRef.current) {
                  editorRef.current.focus();
                }
                setShowLinkDialog(true);
              }}
            >
              <Link className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end" side="top">
            <div className="space-y-3">
              <Label className="text-xs font-medium text-muted-foreground">Link</Label>
              <div className="space-y-2">
                <Input
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Texto do link"
                  className="h-8 text-xs"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && linkText && linkUrl) {
                      e.preventDefault();
                      insertLink();
                    }
                  }}
                />
                <Input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://exemplo.com"
                  className="h-8 text-xs"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && linkText && linkUrl) {
                      e.preventDefault();
                      insertLink();
                    }
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={insertLink}
                  disabled={!linkText || !linkUrl}
                  className="h-7 text-xs w-full"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Inserir Link
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex-1" />
        
        {/* Character counter */}
        <span className={`text-xs font-medium ${
          currentLength > maxLength * 0.9 
            ? currentLength === maxLength 
              ? 'text-destructive' 
              : 'text-yellow-600' 
            : 'text-muted-foreground'
        }`}>
          {currentLength}/{maxLength}
        </span>
      </div>

      {/* Editor WYSIWYG */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onMouseUp={handleSelectionChange}
          onKeyUp={handleSelectionChange}
          className="w-full min-h-24 p-4 bg-card border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-sm"
          style={{ lineHeight: '1.6' }}
          data-placeholder={placeholder}
        />
        

      </div>
    </div>
  );
}