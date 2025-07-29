import React, { useCallback, useRef } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { RichTextEditor } from './RichTextEditor';
import { WizardConfig } from './WizardContext';
import { useTranslation } from '../i18n/LanguageContext';
import { Upload, Palette, Image, Share2, Sun, Moon, X, Info, Copyright } from 'lucide-react';

interface VisualIdentityStepProps {
  config: WizardConfig;
  updateConfig: (updates: Partial<WizardConfig>) => void;
  onQuickSetup: () => void;
}

export function VisualIdentityStep({ config, updateConfig, onQuickSetup }: VisualIdentityStepProps) {
  const { t } = useTranslation();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const shareImageInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((
    file: File | null, 
    field: 'logo' | 'favicon' | 'shareImage'
  ) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      // Aplicar imagem diretamente sem crop
      updateConfig({ [field]: imageUrl });
    };
    reader.readAsDataURL(file);
  }, [updateConfig]);

  const handleImageRemove = useCallback((
    field: 'logo' | 'favicon' | 'shareImage'
  ) => {
    updateConfig({ [field]: null });
  }, [updateConfig]);

  const handleDrop = useCallback((
    e: React.DragEvent<HTMLDivElement>,
    field: 'logo' | 'favicon' | 'shareImage'
  ) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file, field);
    }
  }, [handleImageUpload]);



  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const ImageUploadCard = ({ 
    title, 
    field, 
    value, 
    inputRef, 
    icon: Icon,
    description,
    tooltip
  }: {
    title: string;
    field: 'logo' | 'favicon' | 'shareImage';
    value: string | null;
    inputRef: React.RefObject<HTMLInputElement>;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    tooltip?: string;
  }) => (
    <Card className="transition-all hover:shadow-md h-full">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-start gap-3 mb-3 min-h-[3rem]">
          <Icon className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium block">{title}</Label>
              {tooltip && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </div>
        
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors flex-1 flex items-center justify-center min-h-[8rem]"
          onClick={() => inputRef.current?.click()}
          onDrop={(e) => handleDrop(e, field)}
          onDragOver={handleDragOver}
        >
          {value ? (
            <div className="space-y-3">
              <div className="relative inline-block">
                <img 
                  src={value} 
                  alt={title}
                  className="w-20 h-20 mx-auto object-cover rounded-lg"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 w-7 h-7 rounded-full p-0 shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageRemove(field);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{t('visualIdentity.changeLogo')}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-8 h-8 mx-auto text-gray-400" />
              <p className="text-sm text-muted-foreground">
                {t('visualIdentity.uploadLogo')}
              </p>
              <p className="text-xs text-muted-foreground opacity-75">{description}</p>
            </div>
          )}
        </div>
        
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageUpload(e.target.files?.[0] || null, field)}
        />
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Color Configuration */}
      <div className="space-y-4">

        
        {/* Templates de Cores Pré-Configurados */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2">
            <Label>{t('visualIdentity.colorTemplates')}</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('visualIdentity.colorTemplatesDesc')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="grid grid-cols-5 gap-3">
            {/* Template 1: Purple & Cyan */}
            <Card 
              className="cursor-pointer hover:ring-2 hover:ring-primary transition-all p-3"
              onClick={() => updateConfig({
                primaryColor: '#16a2da',
                secondaryColor: '#000000', 
                tertiaryColor: '#16a2da'
              })}
            >
              <div className="space-y-2">
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#16a2da' }}></div>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#000000' }}></div>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#16a2da' }}></div>
                </div>
                <p className="text-xs text-center text-muted-foreground">Azul & Preto</p>
              </div>
            </Card>

            {/* Template 2: Blue & Orange */}
            <Card 
              className="cursor-pointer hover:ring-2 hover:ring-primary transition-all p-3"
              onClick={() => updateConfig({
                primaryColor: '#d5a05b',
                secondaryColor: '#151515', 
                tertiaryColor: '#c4a174'
              })}
            >
              <div className="space-y-2">
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#d5a05b' }}></div>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#151515' }}></div>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#c4a174' }}></div>
                </div>
                <p className="text-xs text-center text-muted-foreground">Dourado & Preto</p>
              </div>
            </Card>

            {/* Template 3: Green & Teal */}
            <Card 
              className="cursor-pointer hover:ring-2 hover:ring-primary transition-all p-3"
              onClick={() => updateConfig({
                primaryColor: '#dedede',
                secondaryColor: '#161952', 
                tertiaryColor: '#dedede'
              })}
            >
              <div className="space-y-2">
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#dedede' }}></div>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#161952' }}></div>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#dedede' }}></div>
                </div>
                <p className="text-xs text-center text-muted-foreground">Cinza & Azul</p>
              </div>
            </Card>

            {/* Template 4: Pink & Purple */}
            <Card 
              className="cursor-pointer hover:ring-2 hover:ring-primary transition-all p-3"
              onClick={() => updateConfig({
                primaryColor: '#df58ff',
                secondaryColor: '#0d081d', 
                tertiaryColor: '#df58ff'
              })}
            >
              <div className="space-y-2">
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#df58ff' }}></div>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#0d081d' }}></div>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#df58ff' }}></div>
                </div>
                <p className="text-xs text-center text-muted-foreground">Magenta & Preto</p>
              </div>
            </Card>

            {/* Template 5: Orange & Red */}
            <Card 
              className="cursor-pointer hover:ring-2 hover:ring-primary transition-all p-3"
              onClick={() => updateConfig({
                primaryColor: '#ff7500',
                secondaryColor: '#1a1a1a', 
                tertiaryColor: '#eeeeee'
              })}
            >
              <div className="space-y-2">
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#ff7500' }}></div>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#1a1a1a' }}></div>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#eeeeee' }}></div>
                </div>
                <p className="text-xs text-center text-muted-foreground">Laranja & Cinza</p>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>{t('visualIdentity.primaryColor')}</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('visualIdentity.primaryColorDesc')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex gap-2">
              <Input
                type="color"
                value={config.primaryColor}
                onChange={(e) => updateConfig({ 
                  primaryColor: e.target.value,
                  themeColor: e.target.value 
                })}
                className="w-12 h-10 p-1 border rounded"
              />
              <Input
                type="text"
                value={config.primaryColor}
                onChange={(e) => updateConfig({ 
                  primaryColor: e.target.value,
                  themeColor: e.target.value 
                })}
                className="flex-1"
                placeholder="#8B5CF6"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>{t('visualIdentity.menuColor')}</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('visualIdentity.menuColorDesc')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex gap-2">
              <Input
                type="color"
                value={config.secondaryColor}
                onChange={(e) => updateConfig({ secondaryColor: e.target.value })}
                className="w-12 h-10 p-1 border rounded"
              />
              <Input
                type="text"
                value={config.secondaryColor}
                onChange={(e) => updateConfig({ secondaryColor: e.target.value })}
                className="flex-1"
                placeholder="#06B6D4"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>{t('visualIdentity.menuTextColor')}</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('visualIdentity.menuTextColorDesc')}</p>
                  </TooltipContent>
                </Tooltip>
                </TooltipProvider>
            </div>
            <div className="flex gap-2">
              <Input
                type="color"
                value={config.tertiaryColor}
                onChange={(e) => updateConfig({ tertiaryColor: e.target.value })}
                className="w-12 h-10 p-1 border rounded"
              />
              <Input
                type="text"
                value={config.tertiaryColor}
                onChange={(e) => updateConfig({ tertiaryColor: e.target.value })}
                className="flex-1"
                placeholder="#1f2937"
              />
            </div>
          </div>
        </div>
        

      </div>

      {/* Theme Selection */}
      <div className="space-y-3">
        <Label className="text-lg font-medium">{t('visualIdentity.theme')}</Label>
        
        <div className="flex gap-2">
          {/* Light Theme Button */}
          <button
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-200 hover:shadow-sm ${
              config.theme === 'light' 
                ? 'border-primary bg-primary/10 text-primary' 
                : 'border-border bg-card hover:bg-muted/50 text-foreground'
            }`}
            onClick={() => updateConfig({ theme: 'light' })}
          >
            <Sun className={`w-4 h-4 ${config.theme === 'light' ? 'text-primary' : 'text-yellow-500'}`} />
            <span className="text-sm font-medium">{t('visualIdentity.light')}</span>

          </button>

          {/* Dark Theme Button */}
          <button
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-200 hover:shadow-sm ${
              config.theme === 'dark' 
                ? 'border-primary bg-primary/10 text-primary' 
                : 'border-border bg-card hover:bg-muted/50 text-foreground'
            }`}
            onClick={() => updateConfig({ theme: 'dark' })}
          >
            <Moon className={`w-4 h-4 ${config.theme === 'dark' ? 'text-primary' : 'text-blue-500'}`} />
            <span className="text-sm font-medium">{t('visualIdentity.dark')}</span>

          </button>
        </div>
      </div>

      {/* Image Uploads */}
      <div className="space-y-4">
        <Label className="text-lg font-medium">{t('visualIdentity.identityImages')}</Label>
        
        <div className="space-y-4 flex flex-col items-center">
          {/* Logo and Favicon in the same row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full">
            <ImageUploadCard
              title={t('visualIdentity.logo')}
              field="logo"
              value={config.logo}
              inputRef={logoInputRef}
              icon={Image}
              description={t('visualIdentity.logoSize')}
              tooltip={t('visualIdentity.logoTooltip')}
            />
            
            <ImageUploadCard
              title={t('visualIdentity.favicon')}
              field="favicon"
              value={config.favicon}
              inputRef={faviconInputRef}
              icon={Image}
              description={t('visualIdentity.faviconSize')}
              tooltip={t('visualIdentity.faviconTooltip')}
            />
          </div>
          
          {/* Share Image in its own row */}
          <div className="max-w-4xl w-full">
            <ImageUploadCard
              title={t('visualIdentity.shareImage')}
              field="shareImage"
              value={config.shareImage}
              inputRef={shareImageInputRef}
              icon={Share2}
              description={t('visualIdentity.shareImageSize')}
              tooltip={t('visualIdentity.shareImageTooltip')}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-medium">{t('generalSettings.footer')}</Label>
        </div>
        
        <div className="space-y-2">
          <RichTextEditor
            value={config.footer}
            onChange={(value) => updateConfig({ 
              footer: value,
              footerText: value 
            })}
            placeholder={t('generalSettings.footerPlaceholder')}
            maxLength={200}
          />
        </div>
      </div>

      {/* Quick Setup Option */}
      <div className="flex justify-start">

      </div>


    </div>
  );
}