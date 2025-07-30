import React, { useCallback, useRef } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { WizardConfig } from './WizardContext';
import { useTranslation } from '../i18n/LanguageContext';
import { 
  Users, BookOpen, Trophy, Home, 
  Award, Play, MapPin, Bot, Check, Plus, X,
  BookMarked, GraduationCap, MessageSquare, Menu
} from 'lucide-react';
import { 
  getMenuUuidFromUrl, 
  saveAllMenuItems 
} from '../api/menuItemsService';

interface TemplatesStepProps {
  config: WizardConfig;
  updateConfig: (updates: Partial<WizardConfig>) => void;
}



export function TemplatesStep({ config, updateConfig }: TemplatesStepProps) {
  const { t } = useTranslation();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Save menu configuration to API
  const saveMenuConfig = useCallback(async () => {
    const menuUuid = getMenuUuidFromUrl();
    if (!menuUuid) {
      // API integration is optional - silently return if no menuUuid is provided
      return;
    }

    if (config.selectedMenus.length === 0) {
      console.log('No menus selected, skipping API save');
      return;
    }

    try {
      await saveAllMenuItems(menuUuid, config.selectedMenus, config.mainMenu);
      console.log('Menu configuration saved successfully');
    } catch (error) {
      console.error('Failed to save menu configuration:', error);
    }
  }, [config.selectedMenus, config.mainMenu]);

  // Debounced save function to avoid too many API calls
  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(saveMenuConfig, 1000);
  }, [saveMenuConfig]);

  const templates = [
    {
      id: 'community' as const,
      name: t('templates.templateTypes.community.name'),
      description: t('templates.templateTypes.community.description'),
      icon: MessageSquare,
      menus: [t('templates.menus.Comunidade'), t('templates.menus.Vitrine/Cursos'), t('templates.menus.Mural de Membros')],
      mainMenu: t('templates.menus.Comunidade')
    },
    {
      id: 'courses' as const,
      name: t('templates.templateTypes.courses.name'),
      description: t('templates.templateTypes.courses.description'),
      icon: GraduationCap,
      menus: [t('templates.menus.Vitrine/Cursos'), t('templates.menus.Continuar assistindo'), t('templates.menus.Comunidade'), t('templates.menus.Trilhas de Aprendizado'), t('templates.menus.Agentes IA')],
      mainMenu: t('templates.menus.Vitrine/Cursos')
    },
    {
      id: 'educational' as const,
      name: t('templates.templateTypes.educational.name'),
      description: t('templates.templateTypes.educational.description'),
      icon: BookMarked,
      menus: [t('templates.menus.Vitrine/Cursos'), t('templates.menus.Continuar assistindo')],
      mainMenu: t('templates.menus.Vitrine/Cursos')
    }
  ];

  const allMenus = [
    { id: t('templates.menus.Comunidade'), icon: Users },
    { id: t('templates.menus.Vitrine/Cursos'), icon: BookOpen },
    { id: t('templates.menus.Mural de Membros'), icon: Users },
    { id: t('templates.menus.Continuar assistindo'), icon: Play },
    { id: t('templates.menus.Trilhas de Aprendizado'), icon: MapPin },
    { id: t('templates.menus.Desafios'), icon: Award },
    { id: t('templates.menus.Home do Membro'), icon: Home },
    { id: t('templates.menus.Agentes IA'), icon: Bot }
  ];
  const handleTemplateSelect = (template: typeof templates[0]) => {
    // Se o template já está selecionado, deseleciona e limpa os menus
    if (config.selectedTemplate === template.id) {
      updateConfig({
        selectedTemplate: null,
        selectedMenus: [],
        mainMenu: ''
      });
    } else {
      // Caso contrário, seleciona o template e aplica os menus
      updateConfig({
        selectedTemplate: template.id,
        selectedMenus: template.menus,
        mainMenu: template.mainMenu
      });
    }
    // Save to API after template selection
    setTimeout(() => debouncedSave(), 100);
  };

  const handleMenuToggle = (menuId: string) => {
    const isCurrentlySelected = config.selectedMenus.includes(menuId);
    const newMenus = isCurrentlySelected
      ? config.selectedMenus.filter(m => m !== menuId)
      : [...config.selectedMenus, menuId];
    
    // Se estamos adicionando um menu e não há menu principal definido, torna-o principal
    if (!isCurrentlySelected && !config.mainMenu) {
      updateConfig({ 
        selectedMenus: newMenus,
        mainMenu: menuId 
      });
    } else {
      updateConfig({ selectedMenus: newMenus });
      
      // If removing the main menu, set a new main menu
      if (menuId === config.mainMenu && !newMenus.includes(menuId)) {
        updateConfig({ mainMenu: newMenus[0] || '' });
      }
    }
    // Save to API after menu toggle
    debouncedSave();
  };

  const handleMainMenuSelect = (menuId: string) => {
    updateConfig({ mainMenu: menuId });
    // Save to API after main menu selection
    debouncedSave();
  };

  return (
    <div className="space-y-6">
      {/* Menu Orientation */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-medium">{t('templates.menuOrientation')}</Label>
        </div>
        
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${
              config.menuOrientation === 'horizontal' 
                ? 'ring-2 ring-primary bg-primary/5' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => {
              updateConfig({ menuOrientation: 'horizontal' });
              debouncedSave();
            }}
          >
            <CardContent className="p-3">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center">
                  <div className="flex gap-0.5">
                    <div className={`w-1.5 h-1.5 rounded-sm ${
                      config.menuOrientation === 'horizontal' ? 'bg-primary' : 'bg-gray-400'
                    }`}></div>
                    <div className={`w-1.5 h-1.5 rounded-sm ${
                      config.menuOrientation === 'horizontal' ? 'bg-primary' : 'bg-gray-400'
                    }`}></div>
                    <div className={`w-1.5 h-1.5 rounded-sm ${
                      config.menuOrientation === 'horizontal' ? 'bg-primary' : 'bg-gray-400'
                    }`}></div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">{t('templates.horizontal')}</Label>

                </div>

              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${
              config.menuOrientation === 'vertical' 
                ? 'ring-2 ring-primary bg-primary/5' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => {
              updateConfig({ menuOrientation: 'vertical' });
              debouncedSave();
            }}
          >
            <CardContent className="p-3">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center">
                  <div className="flex flex-col gap-0.5">
                    <div className={`w-1.5 h-1 rounded-sm ${
                      config.menuOrientation === 'vertical' ? 'bg-primary' : 'bg-gray-400'
                    }`}></div>
                    <div className={`w-1.5 h-1 rounded-sm ${
                      config.menuOrientation === 'vertical' ? 'bg-primary' : 'bg-gray-400'
                    }`}></div>
                    <div className={`w-1.5 h-1 rounded-sm ${
                      config.menuOrientation === 'vertical' ? 'bg-primary' : 'bg-gray-400'
                    }`}></div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">{t('templates.vertical')}</Label>

                </div>

              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Template Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-medium">{t('templates.chooseTemplate')}</Label>
        </div>
        <p className="text-sm text-muted-foreground">
          {t('templates.templateDescription')}
        </p>
        
        <div className="grid gap-4">
          {templates.map((template) => {
            const Icon = template.icon;
            const isSelected = config.selectedTemplate === template.id;
            
            return (
              <Card 
                key={template.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center hover:bg-destructive transition-colors">
                        <X className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    {template.menus.map((menu, index) => (
                      <Badge 
                        key={menu}
                        variant={index === 0 ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {menu}
                        {index === 0 && ` (${t('templates.main')})`}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Menu Configuration */}
      <div className="space-y-4">
        <Label className="text-lg font-medium">{t('templates.configureMenus')}</Label>
        
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                {t('templates.selectMenusDescription')}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {allMenus.map((menu) => {
                  const Icon = menu.icon;
                  const isSelected = config.selectedMenus.includes(menu.id);
                  const isMain = config.mainMenu === menu.id;
                  
                  return (
                    <div
                      key={menu.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleMenuToggle(menu.id)}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium flex-1">{menu.id}</span>
                      <Button
                        size="sm"
                        variant={isMain ? "default" : "outline"}
                        className={`text-xs px-3 py-2 h-9 transition-opacity ${
                          isSelected ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMainMenuSelect(menu.id);
                        }}
                      >
                        {isMain ? t('templates.main') : t('templates.makeMain')}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}