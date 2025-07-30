import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';


import { WizardConfig } from './WizardContext';
import { 
  Globe, Type, Check, AlertCircle, 
  Palette, Image, Menu, Monitor, Sparkles, 
  CheckCircle, XCircle, ChevronDown,
  FileText, Languages
} from 'lucide-react';

interface GeneralSettingsStepProps {
  config: WizardConfig;
  updateConfig: (updates: Partial<WizardConfig>) => void;
  onComplete: () => void;
}

export function GeneralSettingsStep({ config, updateConfig, onComplete }: GeneralSettingsStepProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [urlAvailable, setUrlAvailable] = useState<boolean | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [hasUserEditedUrl, setHasUserEditedUrl] = useState(false);

  // Reset hasUserEditedUrl when component mounts or when URL is empty
  useEffect(() => {
    if (!config.customUrl) {
      setHasUserEditedUrl(false);
    }
  }, [config.customUrl]);

  // Função para extrair texto limpo do markdown
  const extractTextFromMarkdown = (markdown: string): string => {
    if (!markdown) return '';
    
    let text = markdown;
    
    // Remover **negrito**
    text = text.replace(/\*\*(.*?)\*\*/g, '$1');
    // Remover *itálico*
    text = text.replace(/(?<!\*)\*(?!\*)([^*]+)\*/g, '$1');
    // Remover <u>sublinhado</u>
    text = text.replace(/<u>(.*?)<\/u>/gi, '$1');
    // Remover [texto](url) - manter apenas o texto
    text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    // Remover spans com style - manter apenas o conteúdo
    text = text.replace(/<span[^>]*>(.*?)<\/span>/gi, '$1');
    // Remover outras tags HTML
    text = text.replace(/<[^>]*>/g, '');
    // Converter quebras de linha para espaços
    text = text.replace(/\n/g, ' ');
    // Remover espaços extras
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
  };

  // Função para converter nome em slug para URL
  const createSlugFromName = (name: string): string => {
    if (!name) return '';
    
    return name
      .toLowerCase()
      .normalize('NFD') // Normaliza acentos
      .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos (acentos)
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais, mantendo espaços e hífens
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplicados
      .replace(/^-|-$/g, '') // Remove hífens do início e fim
      .substring(0, 20); // Limita a 20 caracteres
  };

  const toggleCard = (cardId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedCards(newExpanded);
  };



  // Auto-preenchimento da URL baseado no nome da área
  useEffect(() => {
    // Só atualiza a URL automaticamente se o usuário não tiver editado manualmente
    // e se houver um nome da área definido
    if (!hasUserEditedUrl && config.areaName) {
      const slug = createSlugFromName(config.areaName);
      if (slug && slug !== config.customUrl) {
        updateConfig({ customUrl: slug });
      }
    }
  }, [config.areaName, hasUserEditedUrl, updateConfig]);

  // Mock URL validation
  useEffect(() => {
    if (config.customUrl) {
      const timer = setTimeout(() => {
        // Mock validation - in real app, this would be an API call
        setUrlAvailable(config.customUrl.length >= 3);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [config.customUrl]);

  const handleComplete = async () => {
    setIsLoading(true);
    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    onComplete();
  };

  const isFormValid = true; // Nenhuma validação obrigatória

  const configSummary = [
    {
      id: 'visual-identity',
      title: 'Identidade Visual',
      icon: Palette,
      items: [
        { 
          label: 'Cores da área', 
          value: `Primária: ${config.primaryColor} • Secundária: ${config.secondaryColor} • Terciária: ${config.tertiaryColor}`,
          configured: true 
        },
        { 
          label: 'Logotipo', 
          value: config.logo ? 'Configurado' : 'Não configurado',
          configured: !!config.logo 
        },
        { 
          label: 'Favicon', 
          value: config.favicon ? 'Configurado' : 'Não configurado',
          configured: !!config.favicon 
        },
        { 
          label: 'Imagem de compartilhamento', 
          value: config.shareImage ? 'Configurada' : 'Não configurada',
          configured: !!config.shareImage 
        },
        { 
          label: 'Tema da área', 
          value: config.theme === 'light' ? 'Claro' : 'Escuro',
          configured: true 
        },
        { 
          label: 'Rodapé', 
          value: config.footer ? extractTextFromMarkdown(config.footer) : 'Não definido',
          configured: !!config.footer 
        }
      ]
    },
    {
      id: 'templates',
      title: 'Template e Menus',
      icon: Menu,
      items: [
        { 
          label: 'Template selecionado', 
          value: config.selectedTemplate === 'community' ? 'Comunidade' : 
                 config.selectedTemplate === 'courses' ? 'Cursos/Vitrine' : 
                 config.selectedTemplate === 'gamification' ? 'Gamificação' : 'Não selecionado',
          configured: !!config.selectedTemplate 
        },
        { 
          label: 'Menu principal', 
          value: config.mainMenu || 'Não definido',
          configured: !!config.mainMenu 
        },
        { 
          label: 'Menus selecionados', 
          value: `${config.selectedMenus.length} menu${config.selectedMenus.length !== 1 ? 's' : ''}`,
          configured: config.selectedMenus.length > 0 
        }
      ]
    },
    {
      id: 'login-screen',
      title: 'Tela de Login',
      icon: Monitor,
      items: [
        { 
          label: 'Imagem de fundo', 
          value: config.loginBackground ? 'Personalizada' : 'Padrão do sistema',
          configured: !!config.loginBackground 
        },
        { 
          label: 'Cor do botão', 
          value: config.loginButtonColor,
          configured: true 
        }
      ]
    },
    {
      id: 'general-settings',
      title: 'Configurações Gerais',
      icon: Globe,
      items: [
        { 
          label: 'Nome da área', 
          value: config.areaName || 'Não definido',
          configured: !!config.areaName 
        },
        { 
          label: 'URL personalizada', 
          value: config.customUrl || 'Não definida',
          configured: !!config.customUrl 
        },
        { 
          label: 'Descrição da área', 
          value: config.areaDescription || 'Não definida',
          configured: !!config.areaDescription 
        },
        { 
          label: 'Idioma padrão', 
          value: config.defaultLanguage === 'pt-BR' ? 'Português (Brasil)' :
                 config.defaultLanguage === 'es-ES' ? 'Español' :
                 config.defaultLanguage === 'en-US' ? 'English' :
                 config.defaultLanguage === 'it-IT' ? 'Italiano' :
                 config.defaultLanguage === 'fr-FR' ? 'Français' :
                 config.defaultLanguage || 'Não definido',
          configured: !!config.defaultLanguage 
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Area Name */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-medium">Nome da Área de Membros</Label>
        </div>
        
        <div className="space-y-2">
          <Input
            value={config.areaName}
            onChange={(e) => updateConfig({ 
              areaName: e.target.value,
              memberAreaName: e.target.value 
            })}
            placeholder="Ex: Academia do Empreendedor"
            maxLength={50}
            className="text-lg h-12 placeholder:text-gray-400"
          />
          
          <div className="text-xs text-muted-foreground">
            {config.areaName?.length || 0}/50 caracteres
          </div>
        </div>
      </div>

      {/* Custom URL */}


      {/* Area Description */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-medium">Descrição da área de membros</Label>
        </div>
        
        <div className="space-y-2">
          <Textarea
            value={config.areaDescription}
            onChange={(e) => updateConfig({ areaDescription: e.target.value })}
            placeholder="Ex: Uma plataforma completa de ensino para empreendedores que desejam transformar suas vidas através do conhecimento e networking..."
            maxLength={500}
            className="min-h-24 resize-none placeholder:text-gray-400"
          />
          
          <div className="text-xs text-muted-foreground">
            {config.areaDescription?.length || 0}/500 caracteres
          </div>
        </div>
      </div>

      {/* Default Language */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-medium">Idioma padrão da área de membros</Label>
        </div>
        
        <div className="space-y-2">
          <Select value={config.defaultLanguage} onValueChange={(value) => updateConfig({ defaultLanguage: value })}>
            <SelectTrigger className="w-full max-w-sm h-12">
              <SelectValue placeholder="Selecione o idioma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
              <SelectItem value="es-ES">Español</SelectItem>
              <SelectItem value="en-US">English</SelectItem>
              <SelectItem value="it-IT">Italiano</SelectItem>
              <SelectItem value="fr-FR">Français</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>





      {/* Complete Button */}
      <Button
        onClick={handleComplete}
        disabled={!isFormValid || isLoading}
        className="w-full bg-primary text-white h-12"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Criando Área de Membros...
          </div>
        ) : (
          "Criar área de membros"
        )}
      </Button>
    </div>
  );
}