import React from 'react';
import { useWizardConfig } from '../WizardContext';
import { LoginScreenStep } from '../LoginScreenStep';
import { WizardPreview } from '../WizardPreview';
import { useTranslation } from '../../i18n/LanguageContext';

export const LoginScreenRoute: React.FC = () => {
  const { config, updateConfig } = useWizardConfig();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">{t('routes.loginScreen.title')}</h1>
          <p className="text-muted-foreground">{t('routes.loginScreen.description')}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <LoginScreenStep 
              config={config}
              updateConfig={updateConfig}
            />
          </div>
          
          <div>
            <WizardPreview 
              config={config}
              currentStep={3}
              updateConfig={updateConfig}
            />
          </div>
        </div>
      </div>
    </div>
  );
};