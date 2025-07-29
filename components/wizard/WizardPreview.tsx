import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { WizardConfig } from './WizardContext';

import { 
  Users, BookOpen, Trophy, Home,
  Award, Play, MapPin, Bot, Eye, Palette,
  Menu, Monitor, Settings, Globe, Type, ChevronDown,
  CheckCircle, XCircle, Info, Sparkles, Heart, 
  MessageCircle, Share, Plus, Search, Bell,
  Calendar, Clock, MapPin as EventPin
} from 'lucide-react';
import exampleCommunityImage from 'figma:asset/cbc995c08421b1c8c7a99541a3311e089681174a.png';
import exampleVitrineImage from 'figma:asset/f3cf12c1e8ca4cb12e14cc49e26c831346e32095.png';
import exampleVitrineLayout from 'figma:asset/6ecf71e89109828507c27b5df8e7e768b5e1c214.png';
import exampleHomeLayout from 'figma:asset/ffa78398f549f92ee09e4c90cf91829109a8b3ee.png';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Switch } from '../ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface WizardPreviewProps {
  config: WizardConfig;
  currentStep: number;
  updateConfig?: (updates: Partial<WizardConfig>) => void;
}

const menuIcons = {
  'Comunidade': Users,
  'Vitrine/Cursos': BookOpen,
  'Mural de Membros': Users,
  'Ranking': Trophy,
  'Continuar assistindo': Play,
  'Trilhas de Aprendizado': MapPin,
  'Desafios': Award,
  'Home do Membro': Home,
  'Agentes IA': Bot
};

// Função para renderizar markdown básico
const renderMarkdown = (text: string) => {
  if (!text) return '';
  
  // Replace **bold** with <strong>
  let rendered = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
  
  // Replace *italic* with <em> (mas não confundir com **)
  rendered = rendered.replace(/(?<!\*)\*(?!\*)([^*]+)\*/g, '<em class="italic">$1</em>');
  
  // Replace [text](url) with <a href="url">text</a>
  rendered = rendered.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:text-primary/80 underline underline-offset-2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  return rendered;
};

// Função para renderizar conteúdo do RichTextEditor
const renderRichText = (text: string) => {
  if (!text) return '';
  
  // Se o texto contém HTML (spans, tags), renderiza diretamente
  if (/<[^>]+>/.test(text)) {
    // Garante que os links tenham target="_blank" e rel="noopener noreferrer" para segurança
    let processedText = text.replace(
      /<a\s+href="([^"]*)"(?![^>]*target=)/gi, 
      '<a href="$1" target="_blank" rel="noopener noreferrer"'
    );
    
    // Adiciona classes para links se não tiverem
    processedText = processedText.replace(
      /<a\s+([^>]*?)(?:class="([^"]*)")?([^>]*?)>/gi, 
      (match, before, existingClass, after) => {
        const classes = existingClass 
          ? `${existingClass} hover:opacity-80 transition-opacity` 
          : 'hover:opacity-80 transition-opacity';
        return `<a ${before}class="${classes}"${after}>`;
      }
    );
    
    return processedText;
  }
  
  // Se é texto simples, converte quebras de linha
  return text.replace(/\n/g, '<br>');
};

export function WizardPreview({ config, currentStep, updateConfig }: WizardPreviewProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [showOverflowMenus, setShowOverflowMenus] = useState(false);
  const [features, setFeatures] = useState({
    challenges: false,
    community: false,
    aiAgents: false
  });

  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const toggleFeature = (feature: keyof typeof features) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  // Função para renderizar conteúdo específico baseado no menu principal
  const renderMenuSpecificContent = () => {
    const mainMenu = config.mainMenu;

    switch (mainMenu) {
      case 'Comunidade':
        return (
          <div className="space-y-4">
            {/* Campo para novo post */}
            <div className="border border-border rounded-lg p-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-xs font-medium">U</span>
                </div>
                <input 
                  type="text" 
                  placeholder="Compartilhe algo com a comunidade..." 
                  className="flex-1 bg-transparent text-xs text-muted-foreground border-none outline-none"
                />
                <Plus className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {/* Filtros */}
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <span 
                className="px-3 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: config.primaryColor }}
              >
                Todos
              </span>
              <span className="px-3 py-1 rounded-full text-xs text-muted-foreground">
                Minhas postagens
              </span>
              <span className="px-3 py-1 rounded-full text-xs text-muted-foreground">
                Salvas
              </span>
            </div>

            {/* Post da comunidade */}
            <div className="border border-border rounded-lg p-3 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-medium">D</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-xs">Daniele Santos</span>
                    <Badge 
                      variant="secondary" 
                      className="text-xs px-1.5 py-0"
                      style={{ backgroundColor: config.primaryColor, color: 'white' }}
                    >
                      Admin
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">Terapeuta de produtividade • 12 minutos atrás em Home</p>
                  <p className="text-xs leading-relaxed">
                    Esse é o espaço para se abrir, conversar, trocar ideias e informações. Lembrando que nossas trocas são repletas de respeito, amor e empatia, sem julgamentos. Marque encontros, compartilhe. Você não está sozinha. Essa é a sua TRIBO! ❤️
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-2 border-t border-border">
                <button className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                  <Heart className="w-3 h-3" />
                  <span className="text-xs">0</span>
                </button>
                <button className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                  <MessageCircle className="w-3 h-3" />
                  <span className="text-xs">0</span>
                </button>
                <button className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                  <Share className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Ver todos comentários */}
            <button className="text-xs text-primary font-medium">
              Ver todos comentários
            </button>
          </div>
        );

      case 'Vitrine/Cursos':
        return (
          <div className="space-y-3">
            {/* Banner Principal */}
            <div className="relative h-16 rounded-lg overflow-hidden bg-gray-300"></div>
            
            {/* 4 Thumbs de Cursos */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { 
                  color: "bg-gray-300",
                  title: "Curso 1"
                },
                { 
                  color: "bg-gray-300",
                  title: "Curso 2"
                },
                { 
                  color: "bg-gray-300",
                  title: "Curso 3"
                },
                { 
                  color: "bg-gray-300",
                  title: "Curso 4"
                }
              ].map((course, index) => (
                <div key={index} className={`relative h-20 rounded-lg overflow-hidden ${course.color}`}>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Ranking':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-1 h-5 rounded-full"
                style={{ backgroundColor: config.primaryColor }}
              />
              <span className="text-sm font-medium text-card-foreground">
                Ranking da Comunidade
              </span>
            </div>
            
            <div className="space-y-2">
              {[
                { name: 'Ana Silva', points: 2450, position: 1 },
                { name: 'João Costa', points: 2380, position: 2 },
                { name: 'Você', points: 2250, position: 3 },
                { name: 'Maria Santos', points: 2100, position: 4 }
              ].map((user, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded border border-border">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                    {user.position}
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-medium">{user.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{user.points} pts</span>
                  <Trophy className={`w-4 h-4 ${user.position === 1 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                </div>
              ))}
            </div>
          </div>
        );



      case 'Mural de Membros':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-1 h-5 rounded-full"
                style={{ backgroundColor: config.primaryColor }}
              />
              <span className="text-sm font-medium text-card-foreground">
                Membros da Comunidade
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Ana Silva', role: 'Mentora', avatar: 'A', color: 'from-blue-500 to-purple-600' },
                { name: 'João Costa', role: 'Especialista', avatar: 'J', color: 'from-green-500 to-teal-600' },
                { name: 'Maria Santos', role: 'Membro', avatar: 'M', color: 'from-pink-500 to-rose-600' },
                { name: 'Pedro Lima', role: 'Membro', avatar: 'P', color: 'from-orange-500 to-red-600' }
              ].map((member, index) => (
                <div key={index} className="border border-border rounded-lg p-3 text-center">
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center`}>
                    <span className="text-white font-medium text-sm">{member.avatar}</span>
                  </div>
                  <h4 className="font-medium text-xs">{member.name}</h4>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Trilhas de Aprendizado':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-1 h-5 rounded-full"
                style={{ backgroundColor: config.primaryColor }}
              />
              <span className="text-sm font-medium text-card-foreground">
                Suas Trilhas
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="border border-border rounded-lg p-3">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <h4 className="font-medium text-xs">Fundamentos do Negócio</h4>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 bg-muted rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full" 
                      style={{ backgroundColor: config.primaryColor, width: '75%' }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">3/4</span>
                </div>
                <p className="text-xs text-muted-foreground">Próximo: Planejamento Estratégico</p>
              </div>
              
              <div className="border border-border rounded-lg p-3">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <h4 className="font-medium text-xs">Marketing Digital</h4>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 bg-muted rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full" 
                      style={{ backgroundColor: config.primaryColor, width: '25%' }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">1/4</span>
                </div>
                <p className="text-xs text-muted-foreground">Próximo: Redes Sociais</p>
              </div>
            </div>
          </div>
        );

      case 'Desafios':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-1 h-5 rounded-full"
                style={{ backgroundColor: config.primaryColor }}
              />
              <span className="text-sm font-medium text-card-foreground">
                Desafios Ativos
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="border border-border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-600" />
                    <h4 className="font-medium text-xs">Desafio 7 Dias</h4>
                  </div>
                  <Badge variant="outline" className="text-xs">Em andamento</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  Complete 7 lições consecutivas
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full" 
                      style={{ width: '57%', backgroundColor: config.primaryColor }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">4/7</span>
                </div>
              </div>
              
              <div className="border border-border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-purple-600" />
                    <h4 className="font-medium text-xs">Mestre da Comunidade</h4>
                  </div>
                  <Badge variant="outline" className="text-xs">Novo</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  Faça 10 postagens na comunidade
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full" 
                      style={{ width: '20%', backgroundColor: config.primaryColor }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">2/10</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Agentes IA':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-1 h-5 rounded-full"
                style={{ backgroundColor: config.primaryColor }}
              />
              <span className="text-sm font-medium text-card-foreground">
                Assistentes Disponíveis
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="border border-border rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-xs mb-1">Coach Virtual</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      Especialista em desenvolvimento pessoal e profissional
                    </p>
                    <Button size="sm" className="h-6 text-xs">
                      Conversar
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="border border-border rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-xs mb-1">Tutor de Negócios</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      Ajuda com estratégias de negócio e empreendedorismo
                    </p>
                    <Button size="sm" className="h-6 text-xs">
                      Conversar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Continuar assistindo':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-1 h-5 rounded-full"
                style={{ backgroundColor: config.primaryColor }}
              />
              <span className="text-sm font-medium text-card-foreground">
                Continue de onde parou
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="border border-border rounded-xl p-4 bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-md transition-all duration-200">
                <div className="flex gap-4">
                  <div className="w-20 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 py-1">
                    <h4 className="font-semibold text-sm mb-2 text-gray-800">Marketing Digital - Aula 3</h4>
                    <p className="text-sm text-gray-600 mb-3">Estratégias de Conteúdo</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full shadow-sm" 
                          style={{ backgroundColor: config.primaryColor, width: '65%' }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">13:20</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-500">65% concluído</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border border-border rounded-xl p-4 bg-gradient-to-br from-emerald-50 to-teal-50 hover:shadow-md transition-all duration-200">
                <div className="flex gap-4">
                  <div className="w-20 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 py-1">
                    <h4 className="font-semibold text-sm mb-2 text-gray-800">Vendas - Aula 1</h4>
                    <p className="text-sm text-gray-600 mb-3">Fundamentos de Vendas</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full shadow-sm" 
                          style={{ backgroundColor: config.primaryColor, width: '20%' }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">4:15</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs text-gray-500">20% concluído</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border border-border rounded-xl p-4 bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-md transition-all duration-200">
                <div className="flex gap-4">
                  <div className="w-20 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 py-1">
                    <h4 className="font-semibold text-sm mb-2 text-gray-800">Copywriting - Aula 2</h4>
                    <p className="text-sm text-gray-600 mb-3">Técnicas de Persuasão</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full shadow-sm" 
                          style={{ backgroundColor: config.primaryColor, width: '45%' }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">8:42</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-xs text-gray-500">45% concluído</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border border-border rounded-xl p-4 bg-gradient-to-br from-orange-50 to-red-50 hover:shadow-md transition-all duration-200">
                <div className="flex gap-4">
                  <div className="w-20 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 py-1">
                    <h4 className="font-semibold text-sm mb-2 text-gray-800">Liderança - Aula 4</h4>
                    <p className="text-sm text-gray-600 mb-3">Gestão de Equipes</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full shadow-sm" 
                          style={{ backgroundColor: config.primaryColor, width: '80%' }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">22:15</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-gray-500">80% concluído</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Home do Membro':
      default:
        return (
          <div className="grid grid-cols-12 gap-3 h-full">
            {/* Coluna Esquerda - Calendário */}
            <div className="col-span-4 space-y-3">
              <div className="bg-card border border-border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-3 h-3" style={{ color: config.primaryColor }} />
                  <span className="text-xs font-medium">Janeiro 2024</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-xs">
                  {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day) => (
                    <div key={day} className="text-center text-muted-foreground text-xs p-1">
                      {day.slice(0, 1)}
                    </div>
                  ))}
                  {Array.from({ length: 31 }, (_, i) => {
                    const day = i + 1;
                    const isToday = day === 17;
                    const hasEvent = day === 29;
                    return (
                      <div 
                        key={day} 
                        className={`text-center p-1 text-xs ${
                          isToday 
                            ? 'text-white rounded text-xs' 
                            : hasEvent 
                            ? 'text-orange-600 font-medium' 
                            : 'text-card-foreground'
                        }`}
                        style={isToday ? { backgroundColor: config.primaryColor } : {}}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Próximo Evento */}
              <div className="bg-card border border-border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-3 h-3 text-orange-500" />
                  <span className="text-xs font-medium">Próximo evento</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium">Simulado 01 - PGE/PR</p>
                  <p className="text-xs text-muted-foreground">29 Dom, 00:00 - 01:30</p>
                  <button 
                    className="w-full py-1 px-2 rounded text-xs text-white font-medium"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    Confirmar presença
                  </button>
                </div>
              </div>
            </div>

            {/* Coluna Central - Notificações e Mural */}
            <div className="col-span-5 space-y-3">
              {/* Notificações */}
              <div className="bg-card border border-border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="w-3 h-3" style={{ color: config.primaryColor }} />
                  <span className="text-xs font-medium">Notificações</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: config.primaryColor }}
                    >
                      <span className="text-white text-xs">●</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium">Simulado 01 - PGE/PR</p>
                      <p className="text-xs text-muted-foreground">29 Dom às 00:00 - 01:30</p>
                    </div>
                    <button 
                      className="px-2 py-1 rounded text-xs text-white"
                      style={{ backgroundColor: config.primaryColor }}
                    >
                      Confirmar presença
                    </button>
                  </div>
                </div>
              </div>

              {/* Mural de Avisos */}
              <div className="bg-card border border-border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="w-3 h-3" style={{ color: config.primaryColor }} />
                  <span className="text-xs font-medium">Mural de avisos</span>
                </div>
                <div className="space-y-2">
                  <div className="bg-cyan-50 border border-cyan-200 rounded p-2">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs">L</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium">Live no Instagram às 19h</p>
                        <p className="text-xs text-muted-foreground">publicado há 5 horas</p>
                        <p className="text-xs mt-1">O professor Ricardo Poli irá compartilhar um pouco do seu conhecimento sobre marketing digital.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  className="w-full mt-2 py-1 px-2 rounded text-xs text-white font-medium"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  Começar aula ●
                </button>
              </div>
            </div>

            {/* Coluna Direita - Eventos */}
            <div className="col-span-3 space-y-3">
              <div className="bg-card border border-border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <EventPin className="w-3 h-3" style={{ color: config.primaryColor }} />
                  <span className="text-xs font-medium">Eventos</span>
                </div>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium">29</span>
                      <span className="text-xs text-muted-foreground">SAB</span>
                    </div>
                    <p className="text-xs font-medium">Simulado 02 - PGE PR</p>
                    <p className="text-xs text-muted-foreground">Domingo, 29/09 às: 00:00 - 01:30</p>
                    <p className="text-xs text-muted-foreground">Avenida Copacabana, 178 - Rio de Janeiro, Brasil</p>
                    <button 
                      className="w-full py-1 px-2 rounded text-xs text-white font-medium"
                      style={{ backgroundColor: config.primaryColor }}
                    >
                      Confirmar presença
                    </button>
                  </div>
                </div>
              </div>

              {/* Assistir Aula */}
              <div className="bg-card border border-border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Play className="w-3 h-3" style={{ color: config.primaryColor }} />
                  <span className="text-xs font-medium">Assistir aula</span>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium">PDFIGHT - Poder Constituinte</p>
                  <button 
                    className="w-full py-1 px-2 rounded text-xs text-white font-medium"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    Começar aula ●
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const renderDefaultHomeMenu = () => {
    if (config.menuOrientation === 'horizontal') {
      return (
        <div 
          className="border-b border-border px-4 py-2"
          style={{ backgroundColor: config.secondaryColor }}
        >
          <div className="flex items-center gap-4 flex-wrap">
            {/* Logo */}
            <div className="flex-shrink-0">
              {config.logo ? (
                <img 
                  src={config.logo} 
                  alt="Logo" 
                  className="w-8 h-8 md:w-10 md:h-10 rounded object-cover" 
                />
              ) : (
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-300 rounded flex items-center justify-center text-gray-700 text-xs md:text-sm font-medium overflow-hidden">
                  M
                </div>
              )}
            </div>
            <button
              onClick={() => updateConfig && updateConfig({ mainMenu: 'Home do Membro' })}
              className="flex items-center gap-2 px-3 py-1.5 rounded whitespace-nowrap hover:opacity-80 transition-opacity cursor-pointer"
              style={{ 
                backgroundColor: config.primaryColor,
                color: config.theme === 'light' ? '#000000' : '#ffffff',
                fontSize: '0.75rem',
                fontWeight: '700'
              }}
            >
              <Home className="w-3 h-3" />
              Home
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex">
          <div 
            className="w-48 border-r border-border px-3 py-2"
            style={{ backgroundColor: config.secondaryColor }}
          >
            <div className="space-y-2">
              {/* Logo preview */}
              <div className="flex justify-center mb-4">
                <div className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center overflow-hidden">
                  {config.logo ? (
                    <img 
                      src={config.logo} 
                      alt="Logo" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium text-gray-700">M</span>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => updateConfig && updateConfig({ mainMenu: 'Home do Membro' })}
                className="flex items-center gap-2 px-4 py-2.5 rounded hover:opacity-80 transition-opacity cursor-pointer w-full text-left"
                style={{ 
                  backgroundColor: config.primaryColor,
                  color: config.theme === 'light' ? '#000000' : '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: '700'
                }}
              >
                <Home className="w-4 h-4" />
                Home
              </button>
            </div>
          </div>
          <div className="flex-1 p-4">
            {renderMenuSpecificContent()}
          </div>
        </div>
      );
    }
  };

  const renderLogoPreview = () => {
    // Não renderiza logo preview
    return null;
  };

  const renderFooterPreview = () => {
    if (!config.footer) return null;
    
    return (
      <div className="mt-4">
        <Card className="shadow-sm border">
          <CardContent className="p-4">
            <div 
              className={`backdrop-blur-sm border border-border rounded-lg px-4 py-3 min-h-[2.5rem] bg-card ${config.theme}`}
              style={{ 
                color: config.theme === 'dark' ? '#ffffff' : '#000000'
              }}
            >
              <div 
                className="text-xs text-center leading-relaxed break-words overflow-wrap-anywhere footer-rich-text"
                style={{ 
                  color: config.theme === 'dark' ? '#ffffff' : '#000000'
                }}
                dangerouslySetInnerHTML={{ __html: renderRichText(config.footer) }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderVisualIdentityPreview = () => (
    <div className={`rounded-lg shadow-sm border overflow-hidden ${config.theme}`}>
      <div className="bg-card text-card-foreground">
        {/* Header with applied visual identity */}


        {/* Sample navigation with visual identity */}
        {config.selectedMenus.length > 0 ? (
          config.menuOrientation === 'horizontal' ? (
            <div 
              className="border-b border-border px-4 py-2"
              style={{ backgroundColor: config.secondaryColor }}
            >
              <div className="flex items-center gap-4 flex-wrap">
                {/* Logo preview */}
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center overflow-hidden">
                    {config.logo ? (
                      <img 
                        src={config.logo} 
                        alt="Logo" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-medium text-gray-700">M</span>
                    )}
                  </div>
                </div>
                {config.selectedMenus.slice(0, 8).map((menu) => {
                  const isMain = menu === config.mainMenu;
                  const Icon = menuIcons[menu as keyof typeof menuIcons] || Home;
                  
                  return (
                    <button
                      key={menu}
                      onClick={() => updateConfig && updateConfig({ mainMenu: menu })}
                      className="flex items-center gap-2 px-3 py-1.5 rounded whitespace-nowrap hover:opacity-80 transition-opacity cursor-pointer"
                      style={isMain ? { 
                        backgroundColor: config.primaryColor,
                        color: config.theme === 'light' ? '#000000' : '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: '700'
                      } : {
                        color: config.tertiaryColor || (config.theme === 'light' ? '#1f2937' : '#d1d5db'),
                        fontSize: '0.75rem',
                        fontWeight: '700'
                      }}
                    >
                      <Icon className="w-3 h-3" />
                      {menu}
                    </button>
                  );
                })}
                {config.selectedMenus.length > 8 && (
                  <span className="text-xs text-muted-foreground">+{config.selectedMenus.length - 8}</span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex">
              <div 
                className="w-48 border-r border-border px-3 py-2"
                style={{ backgroundColor: config.secondaryColor }}
              >
                <div className="space-y-2">
                  {/* Logo preview */}
                  <div className="flex justify-center mb-4">
                    <div className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center overflow-hidden">
                      {config.logo ? (
                        <img 
                          src={config.logo} 
                          alt="Logo" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-700">M</span>
                      )}
                    </div>
                  </div>
                  
                  {config.selectedMenus.slice(0, 8).map((menu) => {
                    const isMain = menu === config.mainMenu;
                    const Icon = menuIcons[menu as keyof typeof menuIcons] || Home;
                    
                    return (
                      <button
                        key={menu}
                        onClick={() => updateConfig && updateConfig({ mainMenu: menu })}
                        className="flex items-center gap-2 px-4 py-2.5 rounded hover:opacity-80 transition-opacity cursor-pointer w-full text-left"
                        style={isMain ? { 
                          backgroundColor: config.primaryColor,
                          color: config.theme === 'light' ? '#000000' : '#ffffff',
                          fontSize: '0.875rem',
                          fontWeight: '700'
                        } : {
                          color: config.tertiaryColor || (config.theme === 'light' ? '#1f2937' : '#d1d5db'),
                          fontSize: '0.875rem',
                          fontWeight: '700'
                        }}
                      >
                        <Icon className="w-4 h-4" />
                        {menu}
                      </button>
                    );
                  })}
                  {config.selectedMenus.length > 8 && (
                    <span className="text-xs text-muted-foreground px-2">+{config.selectedMenus.length - 8}</span>
                  )}
                </div>
              </div>
              <div className="flex-1 p-4">
                {renderMenuSpecificContent()}
              </div>
            </div>
          )
        ) : (
          // Show default Home menu when no menus are configured
          renderDefaultHomeMenu()
        )}

        {/* Content area with visual identity */}
        {config.menuOrientation === 'horizontal' && (
          <div className="p-4">
            {renderMenuSpecificContent()}
          </div>
        )}
      </div>
    </div>
  );

  const renderTemplatePreview = () => {
    // Always render based on current configuration, regardless of template selection
    return (
      <div className={`rounded-lg shadow-sm border overflow-hidden ${config.theme}`}>
        <div className="bg-card text-card-foreground">
          {/* Header */}


          {/* Menu - now always shows user-configured menus */}
          {config.selectedMenus.length > 0 ? (
            config.menuOrientation === 'horizontal' ? (
              <div 
                className="border-b border-border px-4 py-2"
                style={{ backgroundColor: config.secondaryColor }}
              >
                <div className="flex items-center gap-4 flex-wrap">
                  {/* Logo preview */}
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center overflow-hidden">
                      {config.logo ? (
                        <img 
                          src={config.logo} 
                          alt="Logo" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-medium text-gray-700">M</span>
                      )}
                    </div>
                  </div>
                  {config.selectedMenus.slice(0, 8).map((menu) => {
                    const isMain = menu === config.mainMenu;
                    const Icon = menuIcons[menu as keyof typeof menuIcons] || Home;
                    
                    return (
                      <button
                        key={menu}
                        onClick={() => updateConfig && updateConfig({ mainMenu: menu })}
                        className="flex items-center gap-2 px-3 py-1.5 rounded whitespace-nowrap hover:opacity-80 transition-opacity cursor-pointer"
                        style={isMain ? { 
                          backgroundColor: config.primaryColor,
                          color: config.theme === 'light' ? '#000000' : '#ffffff',
                          fontSize: '0.75rem',
                          fontWeight: '700'
                        } : {
                          color: config.tertiaryColor || (config.theme === 'light' ? '#1f2937' : '#d1d5db'),
                          fontSize: '0.75rem',
                          fontWeight: '700'
                        }}
                      >
                        <Icon className="w-3 h-3" />
                        {menu}
                      </button>
                    );
                  })}
                  {config.selectedMenus.length > 8 && (
                    <div 
                      className="relative"
                      onMouseEnter={() => setShowOverflowMenus(true)}
                      onMouseLeave={() => setShowOverflowMenus(false)}
                    >
                      <span 
                        className="text-xs"
                        style={{ color: config.tertiaryColor || (config.theme === 'light' ? '#1f2937' : '#d1d5db') }}
                      >
                        +{config.selectedMenus.length - 8}
                      </span>
                      
                      {showOverflowMenus && (
                        <div className="absolute top-full left-0 mt-1 z-50 min-w-[200px]">
                          <div 
                            className="border border-border rounded-lg shadow-lg p-2"
                            style={{ backgroundColor: config.secondaryColor }}
                          >
                            <div className="space-y-1">
                              {config.selectedMenus.slice(8).map((menuId) => {
                                const Icon = menuIcons[menuId as keyof typeof menuIcons];
                                const isMain = config.mainMenu === menuId;
                                
                                return (
                                  <div
                                    key={menuId}
                                    className="flex items-center gap-2 px-2 py-1.5 rounded text-xs hover:opacity-80 transition-opacity cursor-pointer"
                                    style={{ 
                                      backgroundColor: isMain ? config.primaryColor : 'transparent',
                                      color: isMain 
                                        ? (config.theme === 'light' ? '#000000' : '#ffffff')
                                        : config.tertiaryColor || (config.theme === 'light' ? '#1f2937' : '#d1d5db'),
                                      fontWeight: isMain ? '700' : '700'
                                    }}
                                    onClick={() => updateConfig && updateConfig({ mainMenu: menuId })}
                                  >
                                    <Icon className="w-3 h-3" />
                                    {menuId}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex">
                <div 
                  className="w-48 border-r border-border px-3 py-2"
                  style={{ backgroundColor: config.secondaryColor }}
                >
                  {/* Logo placeholder */}
                  <div className="mb-4 pt-2">
                    <div className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center mx-auto overflow-hidden">
                      {config.logo ? (
                        <img 
                          src={config.logo} 
                          alt="Logo" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-700">M</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {config.selectedMenus.map((menu) => {
                      const isMain = menu === config.mainMenu;
                      const Icon = menuIcons[menu as keyof typeof menuIcons] || Home;
                      
                      return (
                        <button
                          key={menu}
                          onClick={() => updateConfig && updateConfig({ mainMenu: menu })}
                          className="flex items-center gap-2 px-4 py-2.5 rounded hover:opacity-80 transition-opacity cursor-pointer w-full text-left"
                          style={isMain ? { 
                            backgroundColor: config.primaryColor,
                            color: config.theme === 'light' ? '#000000' : '#ffffff',
                            fontSize: '0.875rem',
                            fontWeight: '700'
                          } : {
                            color: config.tertiaryColor || (config.theme === 'light' ? '#1f2937' : '#d1d5db'),
                            fontSize: '0.875rem',
                            fontWeight: '700'
                          }}
                        >
                          <Icon className="w-4 h-4" />
                          {menu}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex-1 p-4">
                  {renderMenuSpecificContent()}
                </div>
              </div>
            )
          ) : (
            // Show default Home menu when no menus are configured
            renderDefaultHomeMenu()
          )}

          {/* Content area - only for horizontal layout */}
          {config.menuOrientation === 'horizontal' && (
            <div className="p-4">
              {renderMenuSpecificContent()}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderLoginPreview = () => {
    if (config.loginOrientation === 'side') {
      // Side layout preview
      return (
        <div className={`rounded-lg shadow-sm border overflow-hidden ${config.theme}`}>
          <div className="bg-card">
            <div className="h-[500px] flex relative">
              {/* Left side - Background image */}
              <div 
                className="w-2/5 relative"
                style={{
                  backgroundImage: config.loginBackground 
                    ? `url(${config.loginBackground})` 
                    : 'linear-gradient(135deg, #1e40af 0%, #1e1b4b 100%)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >

                {/* Overlay for better contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
              </div>
              
              {/* Right side - Login form */}
              <div className="w-3/5 flex items-center justify-center" style={{ backgroundColor: '#151515' }}>
                <div className="w-full max-w-sm mx-8">
                  <div className="text-center mb-8">
                    {config.logo ? (
                      <img src={config.logo} alt="Logo" className="w-12 h-12 mx-auto mb-3 rounded" />
                    ) : (
                      <div 
                        className="w-12 h-12 mx-auto mb-3 rounded flex items-center justify-center text-white font-medium"
                        style={{ backgroundColor: config.primaryColor }}
                      >
                        M
                      </div>
                    )}
                    <h4 className="text-2xl font-medium text-white mb-2">
                      Acesse sua área de membros
                    </h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="relative">
                        <input 
                          type="email"
                          placeholder="Digite seu endereço de e-mail*"
                          className="w-full h-12 px-4 rounded text-white placeholder-gray-400 focus:outline-none"
                          style={{ backgroundColor: '#1e1e1e', border: 'none' }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="relative">
                        <input 
                          type="password"
                          placeholder="Digite"
                          className="w-full h-12 px-4 pr-12 rounded text-white placeholder-gray-400 focus:outline-none"
                          style={{ backgroundColor: '#1e1e1e', border: 'none' }}
                        />
                        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <Button 
                      className="w-full h-12 font-medium"
                      style={{ 
                        backgroundColor: config.loginButtonColor,
                        color: config.loginButtonTextColor
                      }}
                    >
                      Entrar
                    </Button>
                    <div className="text-right">
                      <button className="text-sm text-white">
                        Esqueci minha senha
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Center layout preview (original)
    return (
      <div className={`rounded-lg shadow-sm border overflow-hidden ${config.theme}`}>
        <div className="bg-card">
          <div 
            className="h-[500px] flex items-center justify-center relative"
            style={{
              backgroundImage: config.loginBackground 
                ? `url(${config.loginBackground})` 
                : 'linear-gradient(135deg, #1e40af 0%, #1e1b4b 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >

            <div 
              className="relative z-10 backdrop-blur-sm p-6 rounded-lg shadow-lg max-w-sm w-full mx-4"
              style={{ backgroundColor: 'rgba(21, 21, 21, 0.4)' }}
            >
              <div className="text-center mb-6">
                {config.logo ? (
                  <img src={config.logo} alt="Logo" className="w-12 h-12 mx-auto mb-3 rounded" />
                ) : (
                  <div 
                    className="w-12 h-12 mx-auto mb-3 rounded flex items-center justify-center text-white font-medium"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    M
                  </div>
                )}
                <h4 
                  className="font-medium mb-6"
                  style={{ color: '#ffffff' }}
                >
                  Acesse sua área de membros
                </h4>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <input 
                      type="email"
                      placeholder="Digite seu endereço de e-mail*"
                      className="w-full h-12 px-4 rounded text-white placeholder-gray-400 focus:outline-none"
                      style={{ backgroundColor: '#1e1e1e', border: 'none' }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <input 
                      type="password"
                      placeholder="Digite"
                      className="w-full h-12 px-4 pr-12 rounded text-white placeholder-gray-400 focus:outline-none"
                      style={{ backgroundColor: '#1e1e1e', border: 'none' }}
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <Button 
                  className="w-full h-12 font-medium"
                  style={{ 
                    backgroundColor: config.loginButtonColor,
                    color: config.loginButtonTextColor
                  }}
                >
                  Entrar
                </Button>
                <div className="text-right">
                  <button className="text-sm text-white">
                    Esqueci minha senha
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderConfigurationSummary = () => {
    // Função para calcular itens configurados por seção
    const visualIdentityItems = [
      { label: 'Nome da área', configured: !!config.areaName },
      { label: 'Tema', configured: true }, // sempre tem um tema
      { label: 'Cor primária', configured: !!config.primaryColor },
      { label: 'Cor secundária', configured: !!config.secondaryColor },
      { label: 'Cor terciária', configured: !!config.tertiaryColor },
      { label: 'Logo', configured: !!config.logo },
      { label: 'Favicon', configured: !!config.favicon },
      { label: 'Footer', configured: !!config.footer }
    ];

    const menuNavigationItems = [
      { label: 'Orientação do menu', configured: !!config.menuOrientation },
      { label: 'Menu principal', configured: !!config.mainMenu },
      { label: 'Menus selecionados', configured: config.selectedMenus.length > 0 }
    ];

    const loginScreenItems = [
      { label: 'Orientação', configured: !!config.loginOrientation },
      { label: 'Imagem de fundo', configured: !!config.loginBackground },
      { label: 'Cor do botão', configured: !!config.loginButtonColor },
      { label: 'Cor do texto do botão', configured: !!config.loginButtonTextColor }
    ];

    const generalSettingsItems = [
      { label: 'Nome da área', configured: !!config.areaName },
      { label: 'URL personalizada', configured: !!config.customUrl },
      { label: 'Descrição', configured: !!config.areaDescription },
      { label: 'Idioma', configured: !!config.defaultLanguage }
    ];

    return (
      <Card className="shadow-sm border">
        <CardHeader className="pb-4">
          <h3 className="text-lg font-medium text-card-foreground">Resumo das Configurações</h3>
          <p className="text-sm text-muted-foreground">
            Revise todas as configurações antes de finalizar
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Menu e Navegação */}
            <Card>
              <CardHeader 
                className="pb-3 cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => toggleCard('menu-navigation')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Menu className="w-4 h-4 text-primary" />
                    <h4 className="font-medium text-card-foreground">Menu e Navegação</h4>
                    <ChevronDown 
                      className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                        expandedCards.has('menu-navigation') ? 'transform rotate-180' : ''
                      }`}
                    />
                  </div>
                  <Badge 
                    variant={menuNavigationItems.filter(item => item.configured).length === menuNavigationItems.length ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {menuNavigationItems.filter(item => item.configured).length}/{menuNavigationItems.length} configurado{menuNavigationItems.filter(item => item.configured).length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardHeader>
              {expandedCards.has('menu-navigation') && (
                <CardContent className="pt-0 px-3">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 py-2 border-b border-border/50">
                      {config.menuOrientation ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Orientação do menu:</span>
                        <Badge variant="outline" className="text-xs">
                          {config.menuOrientation === 'horizontal' ? 'Horizontal' : 'Vertical'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 py-2 border-b border-border/50">
                      {config.mainMenu ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Menu principal:</span>
                        <span className="text-sm font-medium">{config.mainMenu || 'Não selecionado'}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 py-2">
                      {config.selectedMenus.length > 0 ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Menus selecionados:</span>
                          <Badge variant="secondary" className="text-xs">{config.selectedMenus.length} itens</Badge>
                        </div>
                        {config.selectedMenus.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {config.selectedMenus.map((menu) => (
                              <Badge key={menu} variant="outline" className="text-xs">
                                {menu}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Identidade Visual */}
            <Card>
              <CardHeader 
                className="pb-3 cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => toggleCard('visual-identity')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-primary" />
                    <h4 className="font-medium text-card-foreground">Identidade Visual</h4>
                    <ChevronDown 
                      className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                        expandedCards.has('visual-identity') ? 'transform rotate-180' : ''
                      }`}
                    />
                  </div>
                  <Badge 
                    variant={visualIdentityItems.filter(item => item.configured).length === visualIdentityItems.length ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {visualIdentityItems.filter(item => item.configured).length}/{visualIdentityItems.length} configurado{visualIdentityItems.filter(item => item.configured).length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardHeader>
              {expandedCards.has('visual-identity') && (
                <CardContent className="pt-0 px-3">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 py-2 border-b border-border/50">
                      {config.areaName ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Nome da área:</span>
                        <span className="text-sm font-medium">{config.areaName || 'Não definido'}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 py-2 border-b border-border/50">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Tema:</span>
                        <Badge variant={config.theme === 'light' ? 'secondary' : 'default'} className="text-xs">
                          {config.theme === 'light' ? 'Claro' : 'Escuro'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 py-2 border-b border-border/50">
                      {config.primaryColor ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Cor primária:</span>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-border"
                            style={{ backgroundColor: config.primaryColor }}
                          />
                          <span className="text-sm font-mono">{config.primaryColor}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 py-2 border-b border-border/50">
                      {config.secondaryColor ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Cor secundária:</span>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-border"
                            style={{ backgroundColor: config.secondaryColor }}
                          />
                          <span className="text-sm font-mono">{config.secondaryColor}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 py-2 border-b border-border/50">
                      {config.tertiaryColor ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Cor terciária:</span>
                        {config.tertiaryColor ? (
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full border border-border"
                              style={{ backgroundColor: config.tertiaryColor }}
                            />
                            <span className="text-sm font-mono">{config.tertiaryColor}</span>
                          </div>
                        ) : (
                          <span className="text-sm font-medium text-muted-foreground">Não definida</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-2 py-2 border-b border-border/50">
                      {config.logo ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Logo:</span>
                        <span className="text-sm font-medium">
                          {config.logo ? 'Configurado' : 'Não definido'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 py-2 border-b border-border/50">
                      {config.favicon ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Favicon:</span>
                        <span className="text-sm font-medium">
                          {config.favicon ? 'Configurado' : 'Não definido'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 py-2">
                      {config.footer ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Footer:</span>
                        <span className="text-sm font-medium">
                          {config.footer ? 'Configurado' : 'Não definido'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Tela de Login */}
            <Card>
              <CardHeader 
                className="pb-3 cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => toggleCard('login-screen')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-primary" />
                    <h4 className="font-medium text-card-foreground">Tela de Login</h4>
                    <ChevronDown 
                      className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                        expandedCards.has('login-screen') ? 'transform rotate-180' : ''
                      }`}
                    />
                  </div>
                  <Badge 
                    variant={loginScreenItems.filter(item => item.configured).length === loginScreenItems.length ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {loginScreenItems.filter(item => item.configured).length}/{loginScreenItems.length} configurado{loginScreenItems.filter(item => item.configured).length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardHeader>
              {expandedCards.has('login-screen') && (
                <CardContent className="pt-0 px-3">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 py-2 border-b border-border/50">
                      {config.loginOrientation ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Orientação:</span>
                        <Badge variant="outline" className="text-xs">
                          {config.loginOrientation === 'side' ? 'Lateral' : 'Central'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 py-2 border-b border-border/50">
                      {config.loginBackground ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Imagem de fundo:</span>
                        <span className="text-sm font-medium">
                          {config.loginBackground ? 'Personalizada' : 'Padrão'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 py-2 border-b border-border/50">
                      {config.loginButtonColor ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Cor do botão:</span>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-border"
                            style={{ backgroundColor: config.loginButtonColor }}
                          />
                          <span className="text-sm font-mono">{config.loginButtonColor}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 py-2">
                      {config.loginButtonTextColor ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Cor do texto do botão:</span>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-border"
                            style={{ backgroundColor: config.loginButtonTextColor }}
                          />
                          <span className="text-sm font-mono">{config.loginButtonTextColor}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Configurações Gerais */}
            <Card>
              <CardHeader 
                className="pb-3 cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => toggleCard('general-settings')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <h4 className="font-medium text-card-foreground">Configurações Gerais</h4>
                    <ChevronDown 
                      className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                        expandedCards.has('general-settings') ? 'transform rotate-180' : ''
                      }`}
                    />
                  </div>
                  <Badge 
                    variant={generalSettingsItems.filter(item => item.configured).length === generalSettingsItems.length ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {generalSettingsItems.filter(item => item.configured).length}/{generalSettingsItems.length} configurado{generalSettingsItems.filter(item => item.configured).length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardHeader>
              {expandedCards.has('general-settings') && (
                <CardContent className="pt-0 px-3">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 py-2 border-b border-border/50">
                      {config.customUrl ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">URL personalizada:</span>
                        <span className="text-sm font-medium font-mono">
                          {config.customUrl || 'Não definida'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 py-2 border-b border-border/50">
                      {config.areaDescription ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Descrição:</span>
                        <span className="text-sm font-medium">
                          {config.areaDescription ? 'Configurada' : 'Não definida'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 py-2">
                      {config.defaultLanguage ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Idioma:</span>
                        <Badge variant="outline" className="text-xs">
                          {config.defaultLanguage === 'pt-BR' ? 'Português' : 
                           config.defaultLanguage === 'en-US' ? 'Inglês' :
                           config.defaultLanguage === 'es-ES' ? 'Español' :
                           config.defaultLanguage === 'it-IT' ? 'Italiano' :
                           config.defaultLanguage === 'fr-FR' ? 'Français' : 'Português'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (currentStep === 4) {
    return (
      <div className="space-y-4">
        {renderConfigurationSummary()}
        
        {/* Future Features Info */}
        <Card className="shadow-sm border">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 cursor-help">
                          <h3 className="font-medium">Continue configurando os menus</h3>
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Após finalizar a configuração da sua área de membros, siga configurando suas experiencias com nossas funcionalidades.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

              </div>
              
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">Desafios</h4>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Crie uma jornada gamificada para seus membros, mantendo-os motivados e entretidos.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <Switch
                    checked={features.challenges}
                    onCheckedChange={() => toggleFeature('challenges')}
                  />
                </div>
                
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">Comunidade</h4>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Fomente conexões genuínas entre seus membros, transformando-os em uma verdadeira família.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <Switch
                    checked={features.community}
                    onCheckedChange={() => toggleFeature('community')}
                  />
                </div>
                
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">Agentes I.A</h4>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ofereça um suporte que escala junto com você, sem perder a qualidade.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <Switch
                    checked={features.aiAgents}
                    onCheckedChange={() => toggleFeature('aiAgents')}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="shadow-sm border">
        <CardHeader className="pb-4">
          <h3 className="text-lg font-medium text-card-foreground">
            {currentStep === 1 && 'Menu de Navegação'}
            {currentStep === 2 && 'Identidade Visual'}
            {currentStep === 3 && 'Tela de Login'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {currentStep === 1 && 'Visualize como ficará o menu de navegação'}
            {currentStep === 2 && 'Visualize como ficará a identidade visual da sua área'}  
            {currentStep === 3 && 'Visualize como ficará a tela de login'}
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          {currentStep === 1 && (
            <>
              {renderLogoPreview()}
              {renderTemplatePreview()}
            </>
          )}
          {currentStep === 2 && renderVisualIdentityPreview()}
          {currentStep === 3 && renderLoginPreview()}
        </CardContent>
      </Card>
      
      {/* Logo preview as separate card for step 2 */}
      {currentStep === 2 && renderLogoPreview()}
      
      {/* Footer preview (only for step 2) */}
      {currentStep === 2 && renderFooterPreview()}
    </div>
  );
}