import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Define your translation resources
// We'll start with English (en) and Spanish (es)
const resources = {
  en: {
    translation: {
      // General
      "Cancel": "Cancel",
      "Saving...": "Saving...",
      "Error": "Error",
      "Success": "Success",
      "An error occurred": "An error occurred while processing your request",
      "Must be logged in": "You must be logged in to perform this action",

      // Airlines
      "Airlines": "Airlines",
      "Add Airline": "Add Airline",
      "Edit Airline": "Edit Airline",
      "Add New Airline": "Add New Airline",
      "Save Changes": "Save Changes",
      "Airline Name": "Airline Name",
      "Name is required": "Name is required",
      "Name must be at least 2 characters": "Name must be at least 2 characters",
      "Name must be less than 50 characters": "Name must be less than 50 characters",
      "Airline updated successfully!": "Airline updated successfully!",
      "Airline added successfully!": "Airline added successfully!",
      "Name": "Name",
      "Created At": "Created At",
      "Actions": "Actions",
    }
  },
  es: {
    translation: {
      // General
      "Cancel": "Cancelar",
      "Saving...": "Guardando...",
      "Error": "Error",
      "Success": "Éxito",
      "An error occurred": "Ocurrió un error al procesar su solicitud",
      "Must be logged in": "Debe iniciar sesión para realizar esta acción",

      // Airlines
      "Airlines": "Aerolíneas",
      "Add Airline": "Añadir Aerolínea",
      "Edit Airline": "Editar Aerolínea",
      "Add New Airline": "Añadir Nueva Aerolínea",
      "Save Changes": "Guardar Cambios",
      "Airline Name": "Nombre de la Aerolínea",
      "Name is required": "El nombre es obligatorio",
      "Name must be at least 2 characters": "El nombre debe tener al menos 2 caracteres",
      "Name must be less than 50 characters": "El nombre debe tener menos de 50 caracteres",
      "Airline updated successfully!": "¡Aerolínea actualizada con éxito!",
      "Airline added successfully!": "¡Aerolínea añadida con éxito!",
      "Name": "Nombre",
      "Created At": "Creado el",
      "Actions": "Acciones",
    }
  }
};

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // Init i18next
  .init({
    resources,
    fallbackLng: 'en', // Use English if detected language is not available
    interpolation: {
      escapeValue: false // React already safes from xss
    },
    detection: {
      // Order and from where user language should be detected
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['cookie', 'localStorage'], // Where to cache detected language
    }
  });

export default i18n; 