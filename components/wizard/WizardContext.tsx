import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { getTenantUuidFromUrl } from '../api/loginConfigService';
import { loadTenantConfiguration } from '../api/tenantCustomizationService';

export interface WizardConfig {
  // Visual Identity
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  themeColor: string; // Main theme color for API compatibility
  logo: string | null;
  favicon: string | null;
  shareImage: string | null;
  theme: 'light' | 'dark';
  
  // Templates & Menus
  selectedTemplate: 'community' | 'courses' | 'educational' | null;
  selectedMenus: string[];
  mainMenu: string;
  menuOrientation: 'horizontal' | 'vertical';
  
  // Login Screen
  loginBackground: string | null;
  loginButtonColor: string;
  loginButtonTextColor: string;
  loginOrientation: 'center' | 'side';
  loginBackgroundImage: string | null;
  loginBgColor: string;
  
  // General Settings
  areaName: string;
  memberAreaName: string; // For API compatibility
  customUrl: string;
  areaDescription: string;
  defaultLanguage: string;
  footer: string;
  footerText: string; // For API compatibility
  siteName: string;
  siteUrl: string;
  additionalScript: string;
  gamificationEnabled: boolean;
}

const defaultConfig: WizardConfig = {
  primaryColor: '#2563eb',
  secondaryColor: '#f8fafc',
  tertiaryColor: '#1f2937',
  themeColor: '#2563eb',
  logo: null,
  favicon: null,
  shareImage: null,
  theme: 'light',
  selectedTemplate: null,
  selectedMenus: [],
  mainMenu: '',
  menuOrientation: 'horizontal',
  loginBackground: null,
  loginButtonColor: '#2563eb',
  loginButtonTextColor: '#ffffff',
  loginOrientation: 'center',
  loginBackgroundImage: null,
  loginBgColor: '#f8fafc',
  areaName: '',
  memberAreaName: '',
  customUrl: '',
  areaDescription: '',
  defaultLanguage: 'pt-BR',
  footer: '',
  footerText: '',
  siteName: '',
  siteUrl: '',
  additionalScript: '',
  gamificationEnabled: false
};

interface WizardContextType {
  config: WizardConfig;
  updateConfig: (updates: Partial<WizardConfig>) => void;
  resetConfig: () => void;
  loadTenantData: (uuid: string) => Promise<boolean>;
  isLoading: boolean;
  hasLoadedTenantData: boolean;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const WizardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<WizardConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedTenantData, setHasLoadedTenantData] = useState(false);

  const updateConfig = (updates: Partial<WizardConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    setHasLoadedTenantData(false);
  };

  const loadTenantData = useCallback(async (uuid: string): Promise<boolean> => {
    if (!uuid || hasLoadedTenantData) {
      return false;
    }

    setIsLoading(true);
    
    try {
      const tenantConfig = await loadTenantConfiguration(uuid);
      
      // Merge loaded config with existing config, keeping existing values where appropriate
      setConfig(prev => ({
        ...prev,
        ...tenantConfig,
        // Keep existing menu configuration if it exists
        selectedMenus: prev.selectedMenus.length > 0 ? prev.selectedMenus : tenantConfig.selectedMenus,
        mainMenu: prev.mainMenu || tenantConfig.mainMenu,
        selectedTemplate: prev.selectedTemplate || tenantConfig.selectedTemplate,
        // Sync related fields
        primaryColor: tenantConfig.themeColor,
        areaName: tenantConfig.memberAreaName,
        footer: tenantConfig.footerText,
      }));
      
      setHasLoadedTenantData(true);
      console.log('Tenant data loaded successfully into wizard context');
      return true;
    } catch (error) {
      // Silently fail - API integration is optional
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [hasLoadedTenantData]);

  // Auto-load tenant data when UUID is available
  useEffect(() => {
    const uuid = getTenantUuidFromUrl();
    if (uuid && !hasLoadedTenantData && !isLoading) {
      loadTenantData(uuid).catch(() => {
        // Silently fail and continue with defaults - API integration is optional
      });
    }
  }, [loadTenantData, hasLoadedTenantData, isLoading]);

  return (
    <WizardContext.Provider value={{ 
      config, 
      updateConfig, 
      resetConfig, 
      loadTenantData, 
      isLoading,
      hasLoadedTenantData 
    }}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizardConfig = () => {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizardConfig must be used within a WizardProvider');
  }
  return context;
};