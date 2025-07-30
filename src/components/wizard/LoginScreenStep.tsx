import React, { useRef, useCallback } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { WizardConfig } from './WizardContext';
import { useTranslation } from '../i18n/LanguageContext';
import { Upload, Monitor, Palette, Eye, LayoutGrid, SplitSquareHorizontal, Type, X } from 'lucide-react';
import { 
  getTenantUuidFromUrl, 
  saveTenantAuthSettings, 
  mapWizardToApiFormat, 
  prepareImagesForApi 
} from '../api/loginConfigService';

interface LoginScreenStepProps {
  config: WizardConfig;
  updateConfig: (updates: Partial<WizardConfig>) => void;
}

const loginButtonPresets = [
  { name: 'Primária', color: '#8B5CF6' },
  { name: 'Secundária', color: '#06B6D4' },
  { name: 'Sucesso', color: '#10B981' },
  { name: 'Aviso', color: '#F59E0B' },
  { name: 'Perigo', color: '#EF4444' },
  { name: 'Escuro', color: '#1F2937' },
];

export function LoginScreenStep({ config, updateConfig }: LoginScreenStepProps) {
  const { t } = useTranslation();
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Save login configuration to API with debounce
  const saveLoginConfig = useCallback(async () => {
    const tenantUuid = getTenantUuidFromUrl();
    if (!tenantUuid) {
      console.warn('No tenant UUID found in URL parameters');
      return;
    }

    try {
      const authData = mapWizardToApiFormat(config);
      const images = await prepareImagesForApi(config.loginBackground, config.loginOrientation);
      
      await saveTenantAuthSettings(tenantUuid, {
        ...authData,
        images,
      });
      
      console.log('Login configuration saved successfully');
    } catch (error) {
      console.error('Failed to save login configuration:', error);
      // You could add toast notifications here if needed
    }
  }, [config]);

  // Debounced save function to avoid too many API calls
  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(saveLoginConfig, 500);
  }, [saveLoginConfig]);

  const handleBackgroundUpload = (file: File | null) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      updateConfig({ loginBackground: e.target?.result as string });
      // Auto-save to API after background upload
      setTimeout(saveLoginConfig, 100); // Immediate save for image uploads
    };
    reader.readAsDataURL(file);
  };

  const handleBackgroundRemove = () => {
    updateConfig({ loginBackground: null });
    // Auto-save to API after background removal
    setTimeout(saveLoginConfig, 100); // Immediate save for image removal
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleBackgroundUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      {/* Login Orientation */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-medium">{t('loginScreen.orientation')}</Label>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
          {/* Centered Layout Card */}
          <Card 
            className={`transition-all duration-200 hover:shadow-md cursor-pointer ${
              config.loginOrientation === 'center' 
                ? 'ring-2 ring-primary bg-primary/5' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => {
              updateConfig({ loginOrientation: 'center' });
              setTimeout(saveLoginConfig, 100); // Immediate save for layout changes
            }}
          >
            <CardContent className="p-3">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-8 h-6 bg-gray-200 rounded flex items-center justify-center">
                  <div className="w-4 h-3 bg-gray-400 rounded-sm"></div>
                </div>
                <div>
                  <Label className="text-xs font-medium">{t('loginScreen.center')}</Label>

                </div>

              </div>
            </CardContent>
          </Card>

          {/* Side Layout Card */}
          <Card 
            className={`transition-all duration-200 hover:shadow-md cursor-pointer ${
              config.loginOrientation === 'side' 
                ? 'ring-2 ring-primary bg-primary/5' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => {
              updateConfig({ loginOrientation: 'side' });
              setTimeout(saveLoginConfig, 100); // Immediate save for layout changes
            }}
          >
            <CardContent className="p-3">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-8 h-6 bg-gray-200 rounded flex">
                  <div className="w-4 h-6 bg-gradient-to-r from-blue-300 to-orange-300 rounded-l"></div>
                  <div className="w-4 h-6 bg-gray-400 rounded-r flex items-center justify-center">
                    <div className="w-2 h-1.5 bg-white rounded-sm"></div>
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-medium">{t('loginScreen.side')}</Label>

                </div>

              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Background Image */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-medium">{t('loginScreen.backgroundImage')}</Label>
        </div>
        
        <Card>
          <CardContent className="p-4">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
              onClick={() => backgroundInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {config.loginBackground ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img 
                      src={config.loginBackground} 
                      alt="Background"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm">
                          {t('loginScreen.changeImage')}
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="bg-red-600/90 backdrop-blur-sm hover:bg-red-700/90"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBackgroundRemove();
                          }}
                        >
                          {t('loginScreen.remove')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 mx-auto text-gray-400" />
                  <div>
                    <p className="font-medium">{t('loginScreen.addBackgroundImage')}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('loginScreen.dragOrClick')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {t('loginScreen.recommendedSize')}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <input
              ref={backgroundInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleBackgroundUpload(e.target.files?.[0] || null)}
            />
          </CardContent>
        </Card>
      </div>

      {/* Login Button Colors */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-medium">{t('loginScreen.buttonColors')}</Label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Login Button Color */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t('loginScreen.buttonColor')}</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={config.loginButtonColor}
                onChange={(e) => {
                  updateConfig({ loginButtonColor: e.target.value });
                  debouncedSave(); // Debounced save for color changes
                }}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                type="text"
                value={config.loginButtonColor}
                onChange={(e) => {
                  updateConfig({ loginButtonColor: e.target.value });
                  debouncedSave(); // Debounced save for color changes
                }}
                className="flex-1"
                placeholder="#8B5CF6"
              />
            </div>
          </div>

          {/* Login Button Text Color */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t('loginScreen.textColor')}</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={config.loginButtonTextColor}
                onChange={(e) => {
                  updateConfig({ loginButtonTextColor: e.target.value });
                  debouncedSave(); // Debounced save for color changes
                }}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                type="text"
                value={config.loginButtonTextColor}
                onChange={(e) => {
                  updateConfig({ loginButtonTextColor: e.target.value });
                  debouncedSave(); // Debounced save for color changes
                }}
                className="flex-1"
                placeholder="#ffffff"
              />
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}