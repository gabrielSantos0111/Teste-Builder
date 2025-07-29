export const translations = {
  'pt-BR': {
    // Main wizard
    wizardTitle: 'Configurar Área de Membros',
    wizardCompleted: 'Área de Membros Criada!',
    wizardCompletedMessage: 'Sua área de membros "{siteName}" foi configurada com sucesso.',
    createNewArea: 'Criar Nova Área',
    previous: 'Anterior',
    next: 'Próximo',
    currentStep: 'Etapa atual',
    goTo: 'Ir para',
    
    // Steps
    steps: {
      menuConfiguration: 'Configuração de menu',
      menuConfigurationDesc: 'Escolha o template e configure os menus',
      systemColors: 'Cores do sistema',
      systemColorsDesc: 'Defina as cores e logotipo',
      loginScreen: 'Tela de Login',
      loginScreenDesc: 'Personalize a experiência de login',
      generalSettings: 'Configurações Gerais',
      generalSettingsDesc: 'Finalize sua área de membros'
    },
    
    // Individual route pages
    routes: {
      menuConfiguration: {
        title: 'Configuração de Menu',
        description: 'Configure sua estrutura de menu da área de membros e templates.'
      },
      visualIdentity: {
        title: 'Identidade Visual',
        description: 'Configure suas cores da marca, tema e logotipo.'
      },
      loginScreen: {
        title: 'Tela de Login',
        description: 'Personalize o fundo e aparência da sua tela de login.'
      },
      generalSettings: {
        title: 'Configurações Gerais',
        description: 'Configure o nome do site, URL e conteúdo do rodapé.'
      }
    },
    
    // Templates Step
    templates: {
      menuOrientation: 'Orientação do Menu',
      horizontal: 'Horizontal (Padrão)',
      vertical: 'Vertical',
      chooseTemplate: 'Escolha um Template (Opcional)',
      templateDescription: 'Clique em um template para aplicá-lo. Clique novamente no template selecionado para removê-lo.',
      configureMenus: 'Configurar Menus',
      selectMenusDescription: 'Selecione os menus que deseja incluir na sua área de membros:',
      main: 'Principal',
      makeMain: 'Tornar Principal',
      
      templateTypes: {
        community: {
          name: 'Comunidade',
          description: 'Focado em interação e engajamento entre membros'
        },
        courses: {
          name: 'Cursos/Vitrine',
          description: 'Ideal para venda e consumo de conteúdo educacional'
        },
        educational: {
          name: 'Educacional',
          description: 'Focado em aprendizagem estruturada e desenvolvimento de habilidades'
        }
      },
      
      menus: {
        'Comunidade': 'Comunidade',
        'Vitrine/Cursos': 'Vitrine/Cursos',
        'Mural de Membros': 'Mural de Membros',
        'Continuar assistindo': 'Continuar assistindo',
        'Trilhas de Aprendizado': 'Trilhas de Aprendizado',
        'Desafios': 'Desafios',
        'Home do Membro': 'Home do Membro',
        'Agentes IA': 'Agentes IA'
      }
    },
    
    // Visual Identity Step
    visualIdentity: {
      theme: 'Tema',
      light: 'Claro',
      dark: 'Escuro',
      primaryColor: 'Cor Primária',
      secondaryColor: 'Cor Secundária',
      logo: 'Logotipo',
      uploadLogo: 'Arraste uma imagem ou clique para enviar',
      changeLogo: 'Clique para alterar',
      removeLogo: 'Remover Logotipo',
      quickSetup: 'Configuração Rápida',
      quickSetupDesc: 'Pular para configurações finais',
      colorTemplates: 'Templates de Cores',
      colorTemplatesDesc: 'Clique em um template para aplicar as cores automaticamente',
      primaryColorDesc: 'Para botões e elementos principais',
      menuColor: 'Cor do menu',
      menuColorDesc: 'Para fundo do menu de navegação',
      menuTextColor: 'Cor da fonte do menu',
      menuTextColorDesc: 'Para texto dos itens do menu',
      identityImages: 'Imagens da Identidade',
      favicon: 'Favicon',
      faviconSize: 'Tamanho recomendado: 192x192 pixels',
      faviconTooltip: 'É o pequeno ícone que aparece na aba do navegador. Ajuda os usuários a identificar rapidamente o seu site entre várias abas abertas, reforçando a sua marca de forma sutil.',
      shareImage: 'Imagem de Compartilhamento',
      shareImageSize: 'Tamanho recomendado: 1200x630 pixels',
      shareImageTooltip: 'É a imagem que aparece quando seu link é compartilhado em redes sociais ou aplicativos de mensagem.',
      logoSize: 'Tamanho recomendado: 165x30 pixels',
      logoTooltip: 'É a imagem da sua marca que aparece em vários lugares da sua área de membros, geralmente no topo da página.'
    },
    
    // Login Screen Step
    loginScreen: {
      backgroundCustomization: 'Personalização do Fundo',
      uploadBackground: 'Carregar Imagem de Fundo',
      changeBackground: 'Alterar Fundo',
      removeBackground: 'Remover Fundo',
      backgroundColor: 'Cor de Fundo',
      orientation: 'Orientação do Login',
      center: 'Centralizado',
      side: 'Lateral',
      backgroundImage: 'Imagem de Fundo',
      changeImage: 'Alterar Imagem',
      remove: 'Remover',
      addBackgroundImage: 'Adicionar Imagem de Fundo',
      dragOrClick: 'Arraste uma imagem ou clique para enviar',
      recommendedSize: 'Recomendado: 1920x1080px, JPG ou PNG',
      buttonColors: 'Cores do Botão de Login',
      buttonColor: 'Cor do Botão',
      textColor: 'Cor do Texto'
    },
    
    // General Settings Step
    generalSettings: {
      siteName: 'Nome do Site',
      siteNamePlaceholder: 'Digite o nome da sua área de membros',
      siteUrl: 'URL do Site',
      siteUrlPlaceholder: 'https://meusite.com',
      footer: 'Rodapé',
      footerPlaceholder: 'Digite o conteúdo do rodapé...',
      complete: 'Finalizar Configuração'
    },
    
    // Rich Text Editor
    richTextEditor: {
      bold: 'Negrito',
      italic: 'Itálico',
      link: 'Link',
      color: 'Cor do texto'
    },
    
    // Preview
    preview: {
      memberArea: 'Área de Membros',
      login: 'Entrar',
      register: 'Cadastrar',
      email: 'E-mail',
      password: 'Senha',
      loginButton: 'Entrar',
      forgotPassword: 'Esqueci minha senha',
      welcome: 'Bem-vindo',
      
      // Menu previews
      community: {
        recentPosts: 'Posts Recentes',
        createPost: 'Criar Post',
        memberInteraction: 'Interação entre Membros'
      },
      
      courses: {
        featuredCourses: 'Cursos em Destaque',
        continueLearning: 'Continue Aprendendo',
        courseProgress: 'Progresso do Curso'
      },
      
      challenges: {
        activeChallenges: 'Desafios Ativos',
        completedChallenges: 'Desafios Concluídos',
        leaderboard: 'Ranking'
      },
      
      memberHome: {
        calendar: 'Calendário',
        announcements: 'Quadro de Avisos',
        quickActions: 'Ações Rápidas',
        recentActivity: 'Atividade Recente'
      }
    }
  },
  
  'en': {
    // Main wizard
    wizardTitle: 'Configure Member Area',
    wizardCompleted: 'Member Area Created!',
    wizardCompletedMessage: 'Your member area "{siteName}" has been successfully configured.',
    createNewArea: 'Create New Area',
    previous: 'Previous',
    next: 'Next',
    currentStep: 'Current step',
    goTo: 'Go to',
    
    // Steps
    steps: {
      menuConfiguration: 'Menu Configuration',
      menuConfigurationDesc: 'Choose template and configure menus',
      systemColors: 'System Colors',
      systemColorsDesc: 'Define colors and logo',
      loginScreen: 'Login Screen',
      loginScreenDesc: 'Customize login experience',
      generalSettings: 'General Settings',
      generalSettingsDesc: 'Finalize your member area'
    },
    
    // Individual route pages
    routes: {
      menuConfiguration: {
        title: 'Menu Configuration',
        description: 'Configure your member area menu structure and templates.'
      },
      visualIdentity: {
        title: 'Visual Identity',
        description: 'Configure your brand colors, theme, and logo.'
      },
      loginScreen: {
        title: 'Login Screen',
        description: 'Customize your login screen background and appearance.'
      },
      generalSettings: {
        title: 'General Settings',
        description: 'Configure your site name, URL, and footer content.'
      }
    },
    
    // Templates Step
    templates: {
      menuOrientation: 'Menu Orientation',
      horizontal: 'Horizontal (Default)',
      vertical: 'Vertical',
      chooseTemplate: 'Choose a Template (Optional)',
      templateDescription: 'Click on a template to apply it. Click again on the selected template to remove it.',
      configureMenus: 'Configure Menus',
      selectMenusDescription: 'Select the menus you want to include in your member area:',
      main: 'Main',
      makeMain: 'Make Main',
      
      templateTypes: {
        community: {
          name: 'Community',
          description: 'Focused on interaction and engagement between members'
        },
        courses: {
          name: 'Courses/Showcase',
          description: 'Ideal for selling and consuming educational content'
        },
        educational: {
          name: 'Educational',
          description: 'Focused on structured learning and skills development'
        }
      },
      
      menus: {
        'Comunidade': 'Community',
        'Vitrine/Cursos': 'Course Showcase',
        'Mural de Membros': 'Member Wall',
        'Continuar assistindo': 'Continue Watching',
        'Trilhas de Aprendizado': 'Learning Paths',
        'Desafios': 'Challenges',
        'Home do Membro': 'Member Home',
        'Agentes IA': 'AI Agents'
      }
    },
    
    // Visual Identity Step
    visualIdentity: {
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      primaryColor: 'Primary Color',
      secondaryColor: 'Secondary Color',
      logo: 'Logo',
      uploadLogo: 'Drag an image or click to upload',
      changeLogo: 'Click to change',
      removeLogo: 'Remove Logo',
      quickSetup: 'Quick Setup',
      quickSetupDesc: 'Skip to final settings',
      colorTemplates: 'Color Templates',
      colorTemplatesDesc: 'Click on a template to apply colors automatically',
      primaryColorDesc: 'For buttons and main elements',
      menuColor: 'Menu color',
      menuColorDesc: 'For navigation menu background',
      menuTextColor: 'Menu text color',
      menuTextColorDesc: 'For menu item text',
      identityImages: 'Identity Images',
      favicon: 'Favicon',
      faviconSize: 'Recommended size: 192x192 pixels',
      faviconTooltip: 'The small icon that appears in the browser tab. Helps users quickly identify your site among multiple open tabs, subtly reinforcing your brand.',
      shareImage: 'Share Image',
      shareImageSize: 'Recommended size: 1200x630 pixels',
      shareImageTooltip: 'The image that appears when your link is shared on social media or messaging apps.',
      logoSize: 'Recommended size: 165x30 pixels',
      logoTooltip: 'Your brand image that appears in various places in your member area, usually at the top of the page.'
    },
    
    // Login Screen Step
    loginScreen: {
      backgroundCustomization: 'Background Customization',
      uploadBackground: 'Upload Background Image',
      changeBackground: 'Change Background',
      removeBackground: 'Remove Background',
      backgroundColor: 'Background Color',
      orientation: 'Login Orientation',
      center: 'Centered',
      side: 'Side',
      backgroundImage: 'Background Image',
      changeImage: 'Change Image',
      remove: 'Remove',
      addBackgroundImage: 'Add Background Image',
      dragOrClick: 'Drag an image or click to upload',
      recommendedSize: 'Recommended: 1920x1080px, JPG or PNG',
      buttonColors: 'Login Button Colors',
      buttonColor: 'Button Color',
      textColor: 'Text Color'
    },
    
    // General Settings Step
    generalSettings: {
      siteName: 'Site Name',
      siteNamePlaceholder: 'Enter your member area name',
      siteUrl: 'Site URL',
      siteUrlPlaceholder: 'https://mysite.com',
      footer: 'Footer',
      footerPlaceholder: 'Enter footer content...',
      complete: 'Complete Configuration'
    },
    
    // Rich Text Editor
    richTextEditor: {
      bold: 'Bold',
      italic: 'Italic',
      link: 'Link',
      color: 'Text color'
    },
    
    // Preview
    preview: {
      memberArea: 'Member Area',
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      loginButton: 'Login',
      forgotPassword: 'Forgot password',
      welcome: 'Welcome',
      
      // Menu previews
      community: {
        recentPosts: 'Recent Posts',
        createPost: 'Create Post',
        memberInteraction: 'Member Interaction'
      },
      
      courses: {
        featuredCourses: 'Featured Courses',
        continueLearning: 'Continue Learning',
        courseProgress: 'Course Progress'
      },
      
      challenges: {
        activeChallenges: 'Active Challenges',
        completedChallenges: 'Completed Challenges',
        leaderboard: 'Leaderboard'
      },
      
      memberHome: {
        calendar: 'Calendar',
        announcements: 'Announcements',
        quickActions: 'Quick Actions',
        recentActivity: 'Recent Activity'
      }
    }
  },
  
  'fr': {
    // Main wizard
    wizardTitle: 'Configurer l\'Espace Membre',
    wizardCompleted: 'Espace Membre Créé !',
    wizardCompletedMessage: 'Votre espace membre "{siteName}" a été configuré avec succès.',
    createNewArea: 'Créer un Nouvel Espace',
    previous: 'Précédent',
    next: 'Suivant',
    currentStep: 'Étape actuelle',
    goTo: 'Aller à',
    
    // Steps
    steps: {
      menuConfiguration: 'Configuration du menu',
      menuConfigurationDesc: 'Choisissez un modèle et configurez les menus',
      systemColors: 'Couleurs du système',
      systemColorsDesc: 'Définissez les couleurs et le logo',
      loginScreen: 'Écran de connexion',
      loginScreenDesc: 'Personnalisez l\'expérience de connexion',
      generalSettings: 'Paramètres généraux',
      generalSettingsDesc: 'Finalisez votre espace membre'
    },
    
    // Individual route pages
    routes: {
      menuConfiguration: {
        title: 'Configuration du Menu',
        description: 'Configurez la structure du menu de votre espace membre et les modèles.'
      },
      visualIdentity: {
        title: 'Identité Visuelle',
        description: 'Configurez vos couleurs de marque, thème et logo.'
      },
      loginScreen: {
        title: 'Écran de Connexion',
        description: 'Personnalisez l\'arrière-plan et l\'apparence de votre écran de connexion.'
      },
      generalSettings: {
        title: 'Paramètres Généraux',
        description: 'Configurez le nom du site, l\'URL et le contenu du pied de page.'
      }
    },
    
    // Templates Step
    templates: {
      menuOrientation: 'Orientation du Menu',
      horizontal: 'Horizontal (Par défaut)',
      vertical: 'Vertical',
      chooseTemplate: 'Choisir un Modèle (Optionnel)',
      templateDescription: 'Cliquez sur un modèle pour l\'appliquer. Cliquez à nouveau sur le modèle sélectionné pour le supprimer.',
      configureMenus: 'Configurer les Menus',
      selectMenusDescription: 'Sélectionnez les menus que vous souhaitez inclure dans votre espace membre :',
      main: 'Principal',
      makeMain: 'Rendre Principal',
      
      templateTypes: {
        community: {
          name: 'Communauté',
          description: 'Axé sur l\'interaction et l\'engagement entre les membres'
        },
        courses: {
          name: 'Cours/Vitrine',
          description: 'Idéal pour vendre et consommer du contenu éducatif'
        },
        educational: {
          name: 'Éducatif',
          description: 'Axé sur l\'apprentissage structuré et le développement des compétences'
        }
      },
      
      menus: {
        'Comunidade': 'Communauté',
        'Vitrine/Cursos': 'Vitrine de Cours',
        'Mural de Membros': 'Mur des Membres',
        'Continuar assistindo': 'Continuer à Regarder',
        'Trilhas de Aprendizado': 'Parcours d\'Apprentissage',
        'Desafios': 'Défis',
        'Home do Membro': 'Accueil Membre',
        'Agentes IA': 'Agents IA'
      }
    },
    
    // Visual Identity Step
    visualIdentity: {
      theme: 'Thème',
      light: 'Clair',
      dark: 'Sombre',
      primaryColor: 'Couleur Primaire',
      secondaryColor: 'Couleur Secondaire',
      logo: 'Logo',
      uploadLogo: 'Glissez une image ou cliquez pour télécharger',
      changeLogo: 'Cliquez pour changer',
      removeLogo: 'Supprimer le Logo',
      quickSetup: 'Configuration Rapide',
      quickSetupDesc: 'Passer aux paramètres finaux',
      colorTemplates: 'Modèles de Couleurs',
      colorTemplatesDesc: 'Cliquez sur un modèle pour appliquer les couleurs automatiquement',
      primaryColorDesc: 'Pour les boutons et éléments principaux',
      menuColor: 'Couleur du menu',
      menuColorDesc: 'Pour l\'arrière-plan du menu de navigation',
      menuTextColor: 'Couleur du texte du menu',
      menuTextColorDesc: 'Pour le texte des éléments du menu',
      identityImages: 'Images d\'Identité',
      favicon: 'Favicon',
      faviconSize: 'Taille recommandée : 192x192 pixels',
      faviconTooltip: 'La petite icône qui apparaît dans l\'onglet du navigateur. Aide les utilisateurs à identifier rapidement votre site parmi plusieurs onglets ouverts, renforçant subtilement votre marque.',
      shareImage: 'Image de Partage',
      shareImageSize: 'Taille recommandée : 1200x630 pixels',
      shareImageTooltip: 'L\'image qui apparaît lorsque votre lien est partagé sur les réseaux sociaux ou les applications de messagerie.',
      logoSize: 'Taille recommandée : 165x30 pixels',
      logoTooltip: 'L\'image de votre marque qui apparaît à divers endroits dans votre espace membre, généralement en haut de la page.'
    },
    
    // Login Screen Step
    loginScreen: {
      backgroundCustomization: 'Personnalisation de l\'Arrière-plan',
      uploadBackground: 'Télécharger une Image d\'Arrière-plan',
      changeBackground: 'Changer l\'Arrière-plan',
      removeBackground: 'Supprimer l\'Arrière-plan',
      backgroundColor: 'Couleur d\'Arrière-plan',
      orientation: 'Orientation',
      center: 'Centre',
      side: 'Côté'
    },
    
    // General Settings Step
    generalSettings: {
      siteName: 'Nom du Site',
      siteNamePlaceholder: 'Entrez le nom de votre espace membre',
      siteUrl: 'URL du Site',
      siteUrlPlaceholder: 'https://monsite.com',
      footer: 'Pied de page',
      footerPlaceholder: 'Entrez le contenu du pied de page...',
      complete: 'Finaliser la Configuration'
    },
    
    // Rich Text Editor
    richTextEditor: {
      bold: 'Gras',
      italic: 'Italique',
      link: 'Lien',
      color: 'Couleur du texte'
    },
    
    // Preview
    preview: {
      memberArea: 'Espace Membre',
      login: 'Se connecter',
      register: 'S\'inscrire',
      email: 'E-mail',
      password: 'Mot de passe',
      loginButton: 'Se connecter',
      forgotPassword: 'Mot de passe oublié',
      welcome: 'Bienvenue',
      
      // Menu previews
      community: {
        recentPosts: 'Publications Récentes',
        createPost: 'Créer une Publication',
        memberInteraction: 'Interaction entre Membres'
      },
      
      courses: {
        featuredCourses: 'Cours en Vedette',
        continueLearning: 'Continuer l\'Apprentissage',
        courseProgress: 'Progression du Cours'
      },
      
      challenges: {
        activeChallenges: 'Défis Actifs',
        completedChallenges: 'Défis Terminés',
        leaderboard: 'Classement'
      },
      
      memberHome: {
        calendar: 'Calendrier',
        announcements: 'Annonces',
        quickActions: 'Actions Rapides',
        recentActivity: 'Activité Récente'
      }
    }
  },
  
  'it': {
    // Main wizard
    wizardTitle: 'Configura Area Membri',
    wizardCompleted: 'Area Membri Creata!',
    wizardCompletedMessage: 'La tua area membri "{siteName}" è stata configurata con successo.',
    createNewArea: 'Crea Nuova Area',
    previous: 'Precedente',
    next: 'Successivo',
    currentStep: 'Passo corrente',
    goTo: 'Vai a',
    
    // Steps
    steps: {
      menuConfiguration: 'Configurazione menu',
      menuConfigurationDesc: 'Scegli il template e configura i menu',
      systemColors: 'Colori del sistema',
      systemColorsDesc: 'Definisci colori e logo',
      loginScreen: 'Schermata di accesso',
      loginScreenDesc: 'Personalizza l\'esperienza di accesso',
      generalSettings: 'Impostazioni generali',
      generalSettingsDesc: 'Finalizza la tua area membri'
    },
    
    // Individual route pages
    routes: {
      menuConfiguration: {
        title: 'Configurazione Menu',
        description: 'Configura la struttura del menu della tua area membri e i template.'
      },
      visualIdentity: {
        title: 'Identità Visiva',
        description: 'Configura i colori del tuo brand, tema e logo.'
      },
      loginScreen: {
        title: 'Schermata di Accesso',
        description: 'Personalizza lo sfondo e l\'aspetto della tua schermata di accesso.'
      },
      generalSettings: {
        title: 'Impostazioni Generali',
        description: 'Configura il nome del sito, URL e contenuto del footer.'
      }
    },
    
    // Templates Step
    templates: {
      menuOrientation: 'Orientamento Menu',
      horizontal: 'Orizzontale (Predefinito)',
      vertical: 'Verticale',
      chooseTemplate: 'Scegli un Template (Opzionale)',
      templateDescription: 'Clicca su un template per applicarlo. Clicca nuovamente sul template selezionato per rimuoverlo.',
      configureMenus: 'Configura Menu',
      selectMenusDescription: 'Seleziona i menu che vuoi includere nella tua area membri:',
      main: 'Principale',
      makeMain: 'Rendi Principale',
      
      templateTypes: {
        community: {
          name: 'Comunità',
          description: 'Focalizzato sull\'interazione e coinvolgimento tra membri'
        },
        courses: {
          name: 'Corsi/Vetrina',
          description: 'Ideale per vendere e fruire contenuti educativi'
        },
        educational: {
          name: 'Educativo',
          description: 'Focalizzato sull\'apprendimento strutturato e sviluppo competenze'
        }
      },
      
      menus: {
        'Comunidade': 'Comunità',
        'Vitrine/Cursos': 'Vetrina Corsi',
        'Mural de Membros': 'Bacheca Membri',
        'Continuar assistindo': 'Continua a Guardare',
        'Trilhas de Aprendizado': 'Percorsi di Apprendimento',
        'Desafios': 'Sfide',
        'Home do Membro': 'Home Membro',
        'Agentes IA': 'Agenti IA'
      }
    },
    
    // Visual Identity Step
    visualIdentity: {
      theme: 'Tema',
      light: 'Chiaro',
      dark: 'Scuro',
      primaryColor: 'Colore Primario',
      secondaryColor: 'Colore Secondario',
      logo: 'Logo',
      uploadLogo: 'Trascina un\'immagine o clicca per caricare',
      changeLogo: 'Clicca per cambiare',
      removeLogo: 'Rimuovi Logo',
      quickSetup: 'Configurazione Rapida',
      quickSetupDesc: 'Salta alle impostazioni finali',
      colorTemplates: 'Template di Colori',
      colorTemplatesDesc: 'Clicca su un template per applicare i colori automaticamente',
      primaryColorDesc: 'Per pulsanti ed elementi principali',
      menuColor: 'Colore del menu',
      menuColorDesc: 'Per lo sfondo del menu di navigazione',
      menuTextColor: 'Colore del testo del menu',
      menuTextColorDesc: 'Per il testo degli elementi del menu',
      identityImages: 'Immagini di Identità',
      favicon: 'Favicon',
      faviconSize: 'Dimensione consigliata: 192x192 pixel',
      faviconTooltip: 'La piccola icona che appare nella scheda del browser. Aiuta gli utenti a identificare rapidamente il tuo sito tra più schede aperte, rafforzando sottilmente il tuo brand.',
      shareImage: 'Immagine di Condivisione',
      shareImageSize: 'Dimensione consigliata: 1200x630 pixel',
      shareImageTooltip: 'L\'immagine che appare quando il tuo link viene condiviso sui social media o app di messaggistica.',
      logoSize: 'Dimensione consigliata: 165x30 pixel',
      logoTooltip: 'L\'immagine del tuo brand che appare in vari luoghi nella tua area membri, solitamente in cima alla pagina.'
    },
    
    // Login Screen Step
    loginScreen: {
      backgroundCustomization: 'Personalizzazione Sfondo',
      uploadBackground: 'Carica Immagine di Sfondo',
      changeBackground: 'Cambia Sfondo',
      removeBackground: 'Rimuovi Sfondo',
      backgroundColor: 'Colore di Sfondo',
      orientation: 'Orientamento',
      center: 'Centro',
      side: 'Lato'
    },
    
    // General Settings Step
    generalSettings: {
      siteName: 'Nome del Sito',
      siteNamePlaceholder: 'Inserisci il nome della tua area membri',
      siteUrl: 'URL del Sito',
      siteUrlPlaceholder: 'https://miositio.com',
      footer: 'Footer',
      footerPlaceholder: 'Inserisci il contenuto del footer...',
      complete: 'Completa Configurazione'
    },
    
    // Rich Text Editor
    richTextEditor: {
      bold: 'Grassetto',
      italic: 'Corsivo',
      link: 'Link',
      color: 'Colore del testo'
    },
    
    // Preview
    preview: {
      memberArea: 'Area Membri',
      login: 'Accedi',
      register: 'Registrati',
      email: 'Email',
      password: 'Password',
      loginButton: 'Accedi',
      forgotPassword: 'Password dimenticata',
      welcome: 'Benvenuto',
      
      // Menu previews
      community: {
        recentPosts: 'Post Recenti',
        createPost: 'Crea Post',
        memberInteraction: 'Interazione tra Membri'
      },
      
      courses: {
        featuredCourses: 'Corsi in Evidenza',
        continueLearning: 'Continua l\'Apprendimento',
        courseProgress: 'Progresso del Corso'
      },
      
      challenges: {
        activeChallenges: 'Sfide Attive',
        completedChallenges: 'Sfide Completate',
        leaderboard: 'Classifica'
      },
      
      memberHome: {
        calendar: 'Calendario',
        announcements: 'Annunci',
        quickActions: 'Azioni Rapide',
        recentActivity: 'Attività Recente'
      }
    }
  },
  
  'es': {
    // Main wizard
    wizardTitle: 'Configurar Área de Miembros',
    wizardCompleted: '¡Área de Miembros Creada!',
    wizardCompletedMessage: 'Tu área de miembros "{siteName}" ha sido configurada exitosamente.',
    createNewArea: 'Crear Nueva Área',
    previous: 'Anterior',
    next: 'Siguiente',
    currentStep: 'Paso actual',
    goTo: 'Ir a',
    
    // Steps
    steps: {
      menuConfiguration: 'Configuración de menú',
      menuConfigurationDesc: 'Elige la plantilla y configura los menús',
      systemColors: 'Colores del sistema',
      systemColorsDesc: 'Define colores y logo',
      loginScreen: 'Pantalla de acceso',
      loginScreenDesc: 'Personaliza la experiencia de acceso',
      generalSettings: 'Configuraciones generales',
      generalSettingsDesc: 'Finaliza tu área de miembros'
    },
    
    // Individual route pages
    routes: {
      menuConfiguration: {
        title: 'Configuración de Menú',
        description: 'Configura la estructura del menú de tu área de miembros y plantillas.'
      },
      visualIdentity: {
        title: 'Identidad Visual',
        description: 'Configura los colores de tu marca, tema y logo.'
      },
      loginScreen: {
        title: 'Pantalla de Acceso',
        description: 'Personaliza el fondo y apariencia de tu pantalla de acceso.'
      },
      generalSettings: {
        title: 'Configuraciones Generales',
        description: 'Configura el nombre del sitio, URL y contenido del pie de página.'
      }
    },
    
    // Templates Step
    templates: {
      menuOrientation: 'Orientación del Menú',
      horizontal: 'Horizontal (Predeterminado)',
      vertical: 'Vertical',
      chooseTemplate: 'Elegir una Plantilla (Opcional)',
      templateDescription: 'Haz clic en una plantilla para aplicarla. Haz clic nuevamente en la plantilla seleccionada para quitarla.',
      configureMenus: 'Configurar Menús',
      selectMenusDescription: 'Selecciona los menús que deseas incluir en tu área de miembros:',
      main: 'Principal',
      makeMain: 'Hacer Principal',
      
      templateTypes: {
        community: {
          name: 'Comunidad',
          description: 'Enfocado en la interacción y compromiso entre miembros'
        },
        courses: {
          name: 'Cursos/Vitrina',
          description: 'Ideal para vender y consumir contenido educativo'
        },
        educational: {
          name: 'Educativo',
          description: 'Enfocado en aprendizaje estructurado y desarrollo de habilidades'
        }
      },
      
      menus: {
        'Comunidade': 'Comunidad',
        'Vitrine/Cursos': 'Vitrina de Cursos',
        'Mural de Membros': 'Muro de Miembros',
        'Continuar assistindo': 'Continuar Viendo',
        'Trilhas de Aprendizado': 'Rutas de Aprendizaje',
        'Desafios': 'Desafíos',
        'Home do Membro': 'Inicio del Miembro',
        'Agentes IA': 'Agentes IA'
      }
    },
    
    // Visual Identity Step
    visualIdentity: {
      theme: 'Tema',
      light: 'Claro',
      dark: 'Oscuro',
      primaryColor: 'Color Primario',
      secondaryColor: 'Color Secundario',
      logo: 'Logo',
      uploadLogo: 'Arrastra una imagen o haz clic para subir',
      changeLogo: 'Haz clic para cambiar',
      removeLogo: 'Quitar Logo',
      quickSetup: 'Configuración Rápida',
      quickSetupDesc: 'Saltar a configuraciones finales',
      colorTemplates: 'Plantillas de Colores',
      colorTemplatesDesc: 'Haz clic en una plantilla para aplicar los colores automáticamente',
      primaryColorDesc: 'Para botones y elementos principales',
      menuColor: 'Color del menú',
      menuColorDesc: 'Para el fondo del menú de navegación',
      menuTextColor: 'Color del texto del menú',
      menuTextColorDesc: 'Para el texto de los elementos del menú',
      identityImages: 'Imágenes de Identidad',
      favicon: 'Favicon',
      faviconSize: 'Tamaño recomendado: 192x192 píxeles',
      faviconTooltip: 'El pequeño ícono que aparece en la pestaña del navegador. Ayuda a los usuarios a identificar rápidamente tu sitio entre múltiples pestañas abiertas, reforzando sutilmente tu marca.',
      shareImage: 'Imagen de Compartir',
      shareImageSize: 'Tamaño recomendado: 1200x630 píxeles',
      shareImageTooltip: 'La imagen que aparece cuando tu enlace es compartido en redes sociales o aplicaciones de mensajería.',
      logoSize: 'Tamaño recomendado: 165x30 píxeles',
      logoTooltip: 'La imagen de tu marca que aparece en varios lugares de tu área de miembros, generalmente en la parte superior de la página.'
    },
    
    // Login Screen Step
    loginScreen: {
      backgroundCustomization: 'Personalización de Fondo',
      uploadBackground: 'Subir Imagen de Fondo',
      changeBackground: 'Cambiar Fondo',
      removeBackground: 'Quitar Fondo',
      backgroundColor: 'Color de Fondo',
      orientation: 'Orientación',
      center: 'Centro',
      side: 'Lateral'
    },
    
    // General Settings Step
    generalSettings: {
      siteName: 'Nombre del Sitio',
      siteNamePlaceholder: 'Ingresa el nombre de tu área de miembros',
      siteUrl: 'URL del Sitio',
      siteUrlPlaceholder: 'https://misitio.com',
      footer: 'Pie de página',
      footerPlaceholder: 'Ingresa el contenido del pie de página...',
      complete: 'Completar Configuración'
    },
    
    // Rich Text Editor
    richTextEditor: {
      bold: 'Negrita',
      italic: 'Cursiva',
      link: 'Enlace',
      color: 'Color del texto'
    },
    
    // Preview
    preview: {
      memberArea: 'Área de Miembros',
      login: 'Iniciar sesión',
      register: 'Registrarse',
      email: 'Correo electrónico',
      password: 'Contraseña',
      loginButton: 'Iniciar sesión',
      forgotPassword: 'Olvidé mi contraseña',
      welcome: 'Bienvenido',
      
      // Menu previews
      community: {
        recentPosts: 'Publicaciones Recientes',
        createPost: 'Crear Publicación',
        memberInteraction: 'Interacción entre Miembros'
      },
      
      courses: {
        featuredCourses: 'Cursos Destacados',
        continueLearning: 'Continuar Aprendiendo',
        courseProgress: 'Progreso del Curso'
      },
      
      challenges: {
        activeChallenges: 'Desafíos Activos',
        completedChallenges: 'Desafíos Completados',
        leaderboard: 'Tabla de Posiciones'
      },
      
      memberHome: {
        calendar: 'Calendario',
        announcements: 'Anuncios',
        quickActions: 'Acciones Rápidas',
        recentActivity: 'Actividad Reciente'
      }
    }
  }
} as const;

export type Language = keyof typeof translations;
export type TranslationKeys = typeof translations['pt-BR'];