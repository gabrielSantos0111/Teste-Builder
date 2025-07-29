export interface InputRegisterMenuItemDto {
  name: string;
  icon: string;
  link: string;
  isMain: boolean;
}

export interface ApiErrorResponse {
  name: string;
  reason: string;
}

// Extract menuUuid from URL parameters
export function getMenuUuidFromUrl(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('menuUuid');
}

// Save or update menu item
export async function saveMenuItem(
  menuUuid: string,
  itemUuid: string,
  itemData: InputRegisterMenuItemDto
): Promise<void> {
  console.log('Saving menu item:', {
    menuUuid,
    itemUuid,
    name: itemData.name,
    icon: itemData.icon,
    link: itemData.link,
    isMain: itemData.isMain
  });

  const response = await fetch(`http://localhost:3000/menus/${menuUuid}/items/${itemUuid}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(itemData),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to save menu item';
    
    try {
      const errorData: ApiErrorResponse = await response.json();
      errorMessage = errorData.reason || errorMessage;
    } catch {
      // If we can't parse the error response, use the default message
    }

    console.error('Menu API Error:', errorMessage);
    throw new Error(errorMessage);
  }

  console.log('Menu item saved successfully');
}

// Storage key for menu item UUIDs
const MENU_ITEMS_STORAGE_KEY = 'wizard_menu_items';

// Generate a simple UUID for menu items (for demo purposes)
export function generateMenuItemUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Get or create UUID for a menu item
export function getMenuItemUuid(menuUuid: string, menuName: string): string {
  try {
    const stored = localStorage.getItem(MENU_ITEMS_STORAGE_KEY);
    const menuItems = stored ? JSON.parse(stored) : {};
    
    const key = `${menuUuid}_${menuName}`;
    
    if (!menuItems[key]) {
      menuItems[key] = generateMenuItemUuid();
      localStorage.setItem(MENU_ITEMS_STORAGE_KEY, JSON.stringify(menuItems));
    }
    
    return menuItems[key];
  } catch (error) {
    console.warn('Failed to access localStorage, generating new UUID:', error);
    return generateMenuItemUuid();
  }
}

// Clear stored menu item UUIDs (useful for testing)
export function clearStoredMenuItems(): void {
  try {
    localStorage.removeItem(MENU_ITEMS_STORAGE_KEY);
    console.log('Cleared stored menu item UUIDs');
  } catch (error) {
    console.warn('Failed to clear stored menu items:', error);
  }
}

// Map wizard menu configuration to API format
export function mapMenuToApiFormat(
  menuName: string,
  isMain: boolean = false,
  icon: string = '',
  link: string = '#'
): InputRegisterMenuItemDto {
  return {
    name: menuName,
    icon: icon || getDefaultIconForMenu(menuName),
    link: link || getDefaultLinkForMenu(menuName),
    isMain: isMain,
  };
}

// Get default icon based on menu name
function getDefaultIconForMenu(menuName: string): string {
  const iconMap: Record<string, string> = {
    'Comunidade': 'users',
    'Vitrine/Cursos': 'book-open',
    'Mural de Membros': 'message-square',
    'Continuar assistindo': 'play-circle',
    'Trilhas de Aprendizado': 'map',
    'Desafios': 'target',
    'Home do Membro': 'home',
    'Agentes IA': 'bot',
  };
  
  return iconMap[menuName] || 'circle';
}

// Get default link based on menu name
function getDefaultLinkForMenu(menuName: string): string {
  const linkMap: Record<string, string> = {
    'Comunidade': '/community',
    'Vitrine/Cursos': '/courses',
    'Mural de Membros': '/member-wall',
    'Continuar assistindo': '/continue-watching',
    'Trilhas de Aprendizado': '/learning-paths',
    'Desafios': '/challenges',
    'Home do Membro': '/home',
    'Agentes IA': '/ai-agents',
  };
  
  return linkMap[menuName] || '/';
}

// Save all menu items from wizard configuration
export async function saveAllMenuItems(
  menuUuid: string,
  selectedMenus: string[],
  mainMenu: string | null
): Promise<void> {
  if (!menuUuid) {
    // Silently return if no menuUuid is provided (API integration is optional)
    return;
  }

  if (selectedMenus.length === 0) {
    console.log('No menus to save');
    return;
  }

  console.log('Saving menu configuration:', {
    menuUuid,
    selectedMenus,
    mainMenu,
    totalItems: selectedMenus.length
  });

  const savePromises = selectedMenus.map(async (menuName) => {
    const itemUuid = getMenuItemUuid(menuUuid, menuName);
    const isMain = mainMenu === menuName;
    const menuData = mapMenuToApiFormat(menuName, isMain);
    
    try {
      await saveMenuItem(menuUuid, itemUuid, menuData);
      return { success: true, menuName };
    } catch (error) {
      console.error(`Failed to save menu item ${menuName}:`, error);
      return { success: false, menuName, error };
    }
  });

  const results = await Promise.allSettled(savePromises);
  
  const successful = results.filter(result => 
    result.status === 'fulfilled' && result.value.success
  ).length;
  
  const failed = results.length - successful;
  
  console.log(`Menu items save completed: ${successful} successful, ${failed} failed`);
}