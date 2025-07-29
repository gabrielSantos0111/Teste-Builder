export interface TenantAuthImageDto {
  type: 'BACKGROUND_DESKTOP' | 'BACKGROUND_MOBILE' | 'ASIDE_DESKTOP';
  file: string; // Base64 encoded
}

export interface InputRegisterTenantAuthDto {
  layout: 'FULL' | 'ASIDE';
  buttonColor: string;
  buttonTextColor: string;
  images: TenantAuthImageDto[];
}

export interface ApiErrorResponse {
  name: string;
  reason: string;
}

// Extract UUID from URL parameters
export function getTenantUuidFromUrl(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('uuid');
}

// Convert image file to base64
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove data:image/jpeg;base64, prefix
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
}

// Convert data URL to base64 (for existing images stored as data URLs)
export function dataUrlToBase64(dataUrl: string): string {
  if (dataUrl.startsWith('data:')) {
    return dataUrl.split(',')[1];
  }
  return dataUrl;
}

// Save tenant authentication settings
export async function saveTenantAuthSettings(
  uuid: string,
  authData: InputRegisterTenantAuthDto
): Promise<void> {
  console.log('Saving tenant auth settings:', {
    uuid,
    layout: authData.layout,
    buttonColor: authData.buttonColor,
    buttonTextColor: authData.buttonTextColor,
    imageCount: authData.images.length
  });

  const response = await fetch(`https://application.curseduca.pro/tenants/${uuid}/auth`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(authData),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to save authentication settings';
    
    try {
      const errorData: ApiErrorResponse = await response.json();
      errorMessage = errorData.reason || errorMessage;
    } catch {
      // If we can't parse the error response, use the default message
    }

    console.error('API Error:', errorMessage);
    throw new Error(errorMessage);
  }

  console.log('Auth settings saved successfully');
}

// Map wizard config to API format
export function mapWizardToApiFormat(config: {
  loginOrientation: 'center' | 'side';
  loginButtonColor: string;
  loginButtonTextColor: string;
  loginBackground: string | null;
}): Omit<InputRegisterTenantAuthDto, 'images'> {
  return {
    layout: config.loginOrientation === 'center' ? 'FULL' : 'ASIDE',
    buttonColor: config.loginButtonColor,
    buttonTextColor: config.loginButtonTextColor,
  };
}

// Prepare images for API
export async function prepareImagesForApi(
  loginBackground: string | null,
  loginOrientation: 'center' | 'side'
): Promise<TenantAuthImageDto[]> {
  const images: TenantAuthImageDto[] = [];

  if (loginBackground) {
    const base64Image = dataUrlToBase64(loginBackground);
    
    if (loginOrientation === 'center') {
      // For FULL layout, send both desktop and mobile background
      images.push({
        type: 'BACKGROUND_DESKTOP',
        file: base64Image,
      });
      images.push({
        type: 'BACKGROUND_MOBILE',
        file: base64Image,
      });
    } else {
      // For ASIDE layout, send aside desktop image
      images.push({
        type: 'ASIDE_DESKTOP',
        file: base64Image,
      });
    }
  }

  return images;
}