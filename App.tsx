import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MemberAreaWizard } from './components/MemberAreaWizard';
import { WizardProvider } from './components/wizard/WizardContext';
import { LanguageProvider } from './components/i18n/LanguageContext';
import { MenuConfigurationRoute } from './components/wizard/routes/MenuConfigurationRoute';
import { VisualIdentityRoute } from './components/wizard/routes/VisualIdentityRoute';
import { LoginScreenRoute } from './components/wizard/routes/LoginScreenRoute';
import { GeneralSettingsRoute } from './components/wizard/routes/GeneralSettingsRoute';
import { getLanguageFromUrl, updateUrlLanguage, Language } from './components/i18n/languageUtils';
import { getTenantUuidFromUrl } from './components/api/loginConfigService';
import { getMenuUuidFromUrl } from './components/api/menuItemsService';

export default function App() {
  const [language, setLanguage] = useState<Language>(getLanguageFromUrl);
  const [tenantUuid, setTenantUuid] = useState<string | null>(getTenantUuidFromUrl);
  const [menuUuid, setMenuUuid] = useState<string | null>(getMenuUuidFromUrl);

  useEffect(() => {
    const handleUrlChange = () => {
      const newLanguage = getLanguageFromUrl();
      if (newLanguage !== language) {
        setLanguage(newLanguage);
      }
      
      const newTenantUuid = getTenantUuidFromUrl();
      if (newTenantUuid !== tenantUuid) {
        setTenantUuid(newTenantUuid);
      }

      const newMenuUuid = getMenuUuidFromUrl();
      if (newMenuUuid !== menuUuid) {
        setMenuUuid(newMenuUuid);
      }
    };

    // Listen for URL changes (back/forward buttons)
    window.addEventListener('popstate', handleUrlChange);
    
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, [language, tenantUuid, menuUuid]);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    updateUrlLanguage(newLanguage);
  };

  return (
    <div className="min-h-screen">
      <LanguageProvider language={language} onLanguageChange={handleLanguageChange}>
        <WizardProvider>
          <Router>
            <Routes>
              {/* Full wizard route */}
              <Route path="/wizard" element={<MemberAreaWizard />} />
              
              {/* Individual step routes */}
              <Route path="/step/1" element={<MenuConfigurationRoute />} />
              <Route path="/step/2" element={<VisualIdentityRoute />} />
              <Route path="/step/3" element={<LoginScreenRoute />} />
              <Route path="/step/4" element={<GeneralSettingsRoute />} />
              
              {/* Named step routes */}
              <Route path="/menu-configuration" element={<MenuConfigurationRoute />} />
              <Route path="/visual-identity" element={<VisualIdentityRoute />} />
              <Route path="/login-screen" element={<LoginScreenRoute />} />
              <Route path="/general-settings" element={<GeneralSettingsRoute />} />
              
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/wizard" replace />} />
              
              {/* Catch-all route - shows complete wizard for any unmatched routes */}
              <Route path="*" element={<MemberAreaWizard />} />
            </Routes>
            
            {/* Display UUIDs for debugging if present */}
            {(tenantUuid || menuUuid) && (
              <div className="fixed bottom-4 right-4 bg-muted text-muted-foreground px-2 py-1 rounded text-xs space-y-1 z-50">
                {tenantUuid && (
                  <div>Tenant: {tenantUuid.slice(0, 8)}...</div>
                )}
                {menuUuid && (
                  <div>Menu: {menuUuid.slice(0, 8)}...</div>
                )}
                <div className="text-xs opacity-75">
                  API Integration Active
                </div>
              </div>
            )}
          </Router>
        </WizardProvider>
      </LanguageProvider>
    </div>
  );
}