export interface TenantCustomization {
  theme?: string;
  customColorTheme?: string;
  mainColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  logoPath?: string;
  ogImagePath?: string;
  isCustomFooterTextEnabled?: boolean;
  customFooterText?: string;
  faviconPath?: string;
}

export interface TenantAuthCustomization {
  layout?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  images?: Array<{
    type: string;
    url: string;
  }>;
}

export interface FindTenantOutputDto {
  id: number;
  uuid: string;
  situation: 'DRAFT' | 'APPROVAL' | 'ACTIVE' | 'INACTIVE';
  name: string;
  slug: string;
  description: string;
  isGamificationEnabled: boolean;
  languageId: number;
  createdAt: string;
  showcaseId: number;
  banner: string;
  customization?: TenantCustomization;
  authCustomization?: TenantAuthCustomization;
  script?: string;
}

export interface ApiErrorResponse {
  name: string;
  reason: string;
}

// Fetch tenant data from API
export async function fetchTenantData(uuid: string): Promise<FindTenantOutputDto> {
  console.log('Fetching tenant data for UUID:', uuid);

  const response = await fetch(`https://application.curseduca.pro/tenants/${uuid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let errorMessage = 'Failed to fetch tenant data';
    
    if (response.status === 404) {
      errorMessage = 'Tenant not found';
    } else {
      try {
        const errorData: ApiErrorResponse = await response.json();
        errorMessage = errorData.reason || errorMessage;
      } catch {
        // If we can't parse the error response, use the default message
      }
    }

    console.error('Tenant API Error:', errorMessage);
    throw new Error(errorMessage);
  }

  const tenantData = await response.json();
  console.log('Tenant data fetched successfully:', {
    uuid: tenantData.uuid,
    name: tenantData.name,
    hasCustomization: !!tenantData.customization,
    hasAuthCustomization: !!tenantData.authCustomization
  });

  return tenantData;
}

// Map API tenant data to wizard configuration format
export function mapTenantDataToWizardConfig(tenantData: FindTenantOutputDto) {
  const customization = tenantData.customization || {};
  const authCustomization = tenantData.authCustomization || {};

  // Map theme colors
  const themeColor = customization.mainColor || '#2563eb';
  const secondaryColor = customization.secondaryColor || '#06B6D4';
  
  // Map auth layout
  const loginOrientation = authCustomization.layout === 'ASIDE' ? 'side' : 'center';
  
  // Find background image from auth images
  let loginBackground: string | null = null;
  if (authCustomization.images && authCustomization.images.length > 0) {
    const backgroundImage = authCustomization.images.find(img => 
      img.type === 'BACKGROUND_DESKTOP' || img.type === 'ASIDE_DESKTOP'
    );
    if (backgroundImage) {
      loginBackground = backgroundImage.url;
    }
  }

  // Map wizard configuration
  const wizardConfig = {
    // Template and menu configuration (keep existing values)
    selectedTemplate: null,
    selectedMenus: [],
    mainMenu: '',
    menuOrientation: 'horizontal' as const,

    // Visual identity from API
    themeColor: themeColor,
    secondaryColor: secondaryColor,
    logo: customization.logoPath || null,

    // Login screen from API
    loginOrientation: loginOrientation as 'center' | 'side',
    loginButtonColor: authCustomization.buttonColor || '#8B5CF6',
    loginButtonTextColor: authCustomization.buttonTextColor || '#ffffff',
    loginBackground: loginBackground,

    // General settings from API
    memberAreaName: tenantData.name || '',
    footerText: customization.isCustomFooterTextEnabled ? customization.customFooterText || '' : '',
    additionalScript: tenantData.script || '',
    gamificationEnabled: tenantData.isGamificationEnabled || false,
  };

  console.log('Mapped tenant data to wizard config:', {
    themeColor,
    secondaryColor,
    hasLogo: !!customization.logoPath,
    loginOrientation,
    memberAreaName: tenantData.name,
    hasFooterText: !!wizardConfig.footerText,
    gamificationEnabled: tenantData.isGamificationEnabled
  });

  return wizardConfig;
}

// Load tenant configuration and return mapped wizard config
export async function loadTenantConfiguration(uuid: string) {
  try {
    const tenantData = await fetchTenantData(uuid);
    return mapTenantDataToWizardConfig(tenantData);
  } catch (error) {
    // Silently fail - API integration is optional
    
    // Return a default configuration if loading fails
    const defaultConfig = {
      selectedTemplate: null,
      selectedMenus: [],
      mainMenu: '',
      menuOrientation: 'horizontal' as const,
      themeColor: '#2563eb',
      secondaryColor: '#06B6D4',
      logo: null,
      loginOrientation: 'center' as 'center' | 'side',
      loginButtonColor: '#8B5CF6',
      loginButtonTextColor: '#ffffff',
      loginBackground: null,
      memberAreaName: '',
      footerText: '',
      additionalScript: '',
      gamificationEnabled: false,
    };
    
    console.log('Using default configuration due to load failure');
    return defaultConfig;
  }
}

// Check if tenant exists (useful for validation)
export async function checkTenantExists(uuid: string): Promise<boolean> {
  try {
    await fetchTenantData(uuid);
    return true;
  } catch (error) {
    return false;
  }
}