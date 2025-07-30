import React, { useState } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Card, CardContent } from './ui/card';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { VisualIdentityStep } from './wizard/VisualIdentityStep';
import { TemplatesStep } from './wizard/TemplatesStep';
import { LoginScreenStep } from './wizard/LoginScreenStep';
import { GeneralSettingsStep } from './wizard/GeneralSettingsStep';
import { WizardPreview } from './wizard/WizardPreview';
import { useWizardConfig, WizardConfig } from './wizard/WizardContext';
import { useTranslation } from './i18n/LanguageContext';

// Export WizardConfig for backward compatibility
export { WizardConfig };

const steps = [
  { id: 1, title: 'Configuração de menu', description: 'Escolha o template e configure os menus' },
  { id: 2, title: 'Cores do sistema', description: 'Defina as cores e logotipo' },
  { id: 3, title: 'Tela de Login', description: 'Personalize a experiência de login' },
  { id: 4, title: 'Configurações Gerais', description: 'Finalize sua área de membros' }
];

export function MemberAreaWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const { config, updateConfig, isLoading, hasLoadedTenantData } = useWizardConfig();
  const { t } = useTranslation();

  const steps = [
    { id: 1, title: t('steps.menuConfiguration'), description: t('steps.menuConfigurationDesc') },
    { id: 2, title: t('steps.systemColors'), description: t('steps.systemColorsDesc') },
    { id: 3, title: t('steps.loginScreen'), description: t('steps.loginScreenDesc') },
    { id: 4, title: t('steps.generalSettings'), description: t('steps.generalSettingsDesc') }
  ];

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (stepNumber: number) => {
    // Allow navigation to any valid step (1-4)
    if (stepNumber >= 1 && stepNumber <= 4) {
      setCurrentStep(stepNumber);
    }
  };

  const handleComplete = () => {
    setIsCompleted(true);
    // Here you would typically save to backend
    console.log('Final configuration:', config);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <TemplatesStep config={config} updateConfig={updateConfig} />;
      case 2:
        return <VisualIdentityStep config={config} updateConfig={updateConfig} onQuickSetup={() => goToStep(4)} />;
      case 3:
        return <LoginScreenStep config={config} updateConfig={updateConfig} />;
      case 4:
        return <GeneralSettingsStep config={config} updateConfig={updateConfig} onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-6 md:p-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="mb-4">{t('wizardCompleted')}</h2>
            <p className="text-muted-foreground mb-6">
              {t('wizardCompletedMessage').replace('{siteName}', config.siteName || '')}
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
            >
              {t('createNewArea')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-6 md:px-12 xl:px-20 py-6 md:py-8" style={{ maxWidth: 'calc(80rem * 1.75)' }}>
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary">
                {t('wizardTitle')}
              </h1>
              {isLoading && (
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  Loading tenant configuration...
                </div>
              )}
              {hasLoadedTenantData && (
                <div className="text-sm text-green-600 mt-2">
                  ✓ Tenant data loaded successfully
                </div>
              )}
            </div>

          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between overflow-x-auto pb-2 px-6">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => goToStep(step.id)}
                    className={`w-8 h-8 min-w-[2rem] rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                      step.id === currentStep 
                        ? 'bg-primary text-white shadow-lg' 
                        : step.id < currentStep 
                          ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer' 
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200 cursor-pointer'
                    } hover:scale-105`}
                    title={
                      step.id === currentStep 
                        ? `${t('currentStep')}: ${step.title}`
                        : step.id < currentStep 
                          ? `${t('goTo')}: ${step.title}`
                          : `${t('goTo')}: ${step.title}`
                    }
                  >
                    {step.id}
                  </button>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 transition-colors ${
                      step.id < currentStep ? 'bg-blue-600' : 'bg-blue-100'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            <Progress value={(currentStep / 4) * 100} className="h-2" />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          <div className="order-2 lg:order-1">
            <Card className="shadow-lg">
              <CardContent className="p-4 md:p-6">
                <div className="mb-4 md:mb-6">
                  <h3 className="text-lg md:text-xl font-semibold mb-2">
                    {steps[currentStep - 1].title}
                  </h3>
                </div>
                
                {renderCurrentStep()}
                
                <div className="flex flex-col gap-3 mt-6 md:mt-8 md:flex-row md:justify-between">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2 justify-center"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {t('previous')}
                  </Button>
                  
                  {currentStep < 4 && (
                    <Button
                      onClick={nextStep}
                      className="flex items-center gap-2 bg-primary hover:bg-primary/90 justify-center"
                    >
                      {t('next')}
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="order-1 lg:order-2">
            <WizardPreview config={config} currentStep={currentStep} updateConfig={updateConfig} />
          </div>
        </div>
      </div>
    </div>
  );
}