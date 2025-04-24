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
      "Confirm": "Confirm",
      "Saving...": "Saving...",
      "Error": "Error",
      "Success": "Success",
      "An error occurred": "An error occurred while processing your request",
      "Must be logged in": "You must be logged in to perform this action",

      // --- Dashboard / Navigation ---
      "app_title": "Sales App",
      "nav_dashboard": "Dashboard",
      "nav_customers": "Customers",
      "nav_airlines": "Airlines",
      "nav_sales": "Sales",
      "logged_in_as": "Logged in as:",
      "switch_light_mode": "Switch to light mode",
      "switch_dark_mode": "Switch to dark mode",
      "logout": "Logout",

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

      // Sales
      "Sales Management": "Sales Management",
      "Add Sale": "Add Sale",
      "Edit Sale": "Edit Sale",
      "Add New Sale": "Add New Sale",
      "Date": "Date",
      "Customer": "Customer",
      "Airline": "Airline",
      "Value": "Value",
      "Cost": "Cost",
      "Sale Date": "Sale Date",
      "Customer ID": "Customer ID",
      "Airline ID": "Airline ID",
      "Sale Value": "Sale Value",
      "Sale Cost": "Sale Cost",
      "Date is required": "Date is required",
      "Invalid Date": "Invalid Date",
      "Customer is required": "Customer is required",
      "Airline is required": "Airline is required",
      "Value is required": "Value is required",
      "Value must be positive": "Value must be positive",
      "Value must be a number": "Value must be a number",
      "Cost is required": "Cost is required",
      "Cost cannot be negative": "Cost cannot be negative",
      "Cost must be a number": "Cost must be a number",
      "Sale updated successfully!": "Sale updated successfully!",
      "Sale added successfully!": "Sale added successfully!",
      "Sale deleted successfully!": "Sale deleted successfully!",
      "Failed to load sales": "Failed to load sales",
      "Failed to delete sale": "Failed to delete sale",
      "Failed to save sale": "Failed to save sale",
      "Confirm Deletion": "Confirm Deletion",
      "Confirm Sale Deletion": "Confirm Sale Deletion",
      "Are you sure you want to delete this sale? This action cannot be undone.": "Are you sure you want to delete this sale? This action cannot be undone.",
      "Are you sure you want to delete the sale for {{customer}} / {{airline}} on {{date}}? This action cannot be undone.": "Are you sure you want to delete the sale for {{customer}} / {{airline}} on {{date}}? This action cannot be undone.",
      "Delete Sale": "Delete Sale",
      "No sales found.": "No sales found.",
      "Unknown Customer": "Unknown Customer",
      "Unknown Airline": "Unknown Airline",
      "Please log in to manage sales.": "Please log in to manage sales.",
      "Must be logged in to view sales": "Must be logged in to view sales",
      "Failed to load customers": "Failed to load customers",
      "Failed to load airlines": "Failed to load airlines",
      "Customer selection is required": "Customer selection is required",
      "Airline selection is required": "Airline selection is required",
      "Sale date is required": "Sale date is required",
      "Sale value is required": "Sale value is required",
      "Sale cost is required": "Sale cost is required",
      "Value must be a positive number": "Value must be a positive number",
      "You must be logged in to save a sale.": "You must be logged in to save a sale.",
      "Authentication required": "Authentication required",
      "update": "update",
      "add": "add",
      "Sale for {{saleInfo}} updated successfully!": "Sale for {{saleInfo}} updated successfully!",
      "Sale for {{saleInfo}} added successfully!": "Sale for {{saleInfo}} added successfully!",
      "Failed to {{action}} sale for {{saleInfo}}": "Failed to {{action}} sale for {{saleInfo}}",
      "Sale for {{saleInfo}} deleted successfully!": "Sale for {{saleInfo}} deleted successfully!",
      "Failed to delete sale for {{saleInfo}}": "Failed to delete sale for {{saleInfo}}",
    }
  },
  es: {
    translation: {
      // General
      "Cancel": "Cancelar",
      "Confirm": "Confirmar",
      "Saving...": "Guardando...",
      "Error": "Error",
      "Success": "Éxito",
      "An error occurred": "Ocurrió un error al procesar su solicitud",
      "Must be logged in": "Debe iniciar sesión para realizar esta acción",

      // --- Dashboard / Navigation ---
      "app_title": "App Ventas",
      "nav_dashboard": "Tablero",
      "nav_customers": "Clientes",
      "nav_airlines": "Aerolíneas",
      "nav_sales": "Ventas",
      "logged_in_as": "Sesión iniciada como:",
      "switch_light_mode": "Cambiar a modo claro",
      "switch_dark_mode": "Cambiar a modo oscuro",
      "logout": "Cerrar sesión",

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

      // Sales
      "Sales Management": "Gestión de Ventas",
      "Add Sale": "Añadir Venta",
      "Edit Sale": "Editar Venta",
      "Add New Sale": "Añadir Nueva Venta",
      "Date": "Fecha",
      "Customer": "Cliente",
      "Airline": "Aerolínea",
      "Value": "Valor",
      "Cost": "Costo",
      "Sale Date": "Fecha Venta",
      "Customer ID": "ID Cliente",
      "Airline ID": "ID Aerolínea",
      "Sale Value": "Valor Venta",
      "Sale Cost": "Costo Venta",
      "Date is required": "La fecha es obligatoria",
      "Invalid Date": "Fecha inválida",
      "Customer is required": "El cliente es obligatorio",
      "Airline is required": "La aerolínea es obligatoria",
      "Value is required": "El valor es obligatorio",
      "Value must be positive": "El valor debe ser positivo",
      "Value must be a number": "El valor debe ser un número",
      "Cost is required": "El costo es obligatorio",
      "Cost cannot be negative": "El costo no puede ser negativo",
      "Cost must be a number": "El costo debe ser un número",
      "Sale updated successfully!": "¡Venta actualizada con éxito!",
      "Sale added successfully!": "¡Venta añadida con éxito!",
      "Sale deleted successfully!": "¡Venta eliminada con éxito!",
      "Failed to load sales": "Error al cargar las ventas",
      "Failed to delete sale": "Error al eliminar la venta",
      "Failed to save sale": "Error al guardar la venta",
      "Confirm Deletion": "Confirmar Eliminación",
      "Confirm Sale Deletion": "Confirmar Eliminación de Venta",
      "Are you sure you want to delete this sale? This action cannot be undone.": "¿Está seguro de que desea eliminar esta venta? Esta acción no se puede deshacer.",
      "Are you sure you want to delete the sale for {{customer}} / {{airline}} on {{date}}? This action cannot be undone.": "¿Está seguro de que desea eliminar la venta para {{customer}} / {{airline}} el {{date}}? Esta acción no se puede deshacer.",
      "Delete Sale": "Eliminar Venta",
      "No sales found.": "No se encontraron ventas.",
      "Unknown Customer": "Cliente Desconocido",
      "Unknown Airline": "Aerolínea Desconocida",
      "Please log in to manage sales.": "Por favor, inicie sesión para gestionar las ventas.",
      "Must be logged in to view sales": "Debe iniciar sesión para ver las ventas",
      "Failed to load customers": "Error al cargar los clientes",
      "Failed to load airlines": "Error al cargar las aerolíneas",
      "Customer selection is required": "La selección del cliente es obligatoria",
      "Airline selection is required": "La selección de la aerolínea es obligatoria",
      "Sale date is required": "La fecha de venta es obligatoria",
      "Sale value is required": "El valor de venta es obligatorio",
      "Sale cost is required": "El costo de venta es obligatorio",
      "Value must be a positive number": "El valor debe ser un número positivo",
      "You must be logged in to save a sale.": "Debe iniciar sesión para guardar una venta.",
      "Authentication required": "Autenticación requerida",
      "update": "actualizar",
      "add": "añadir",
      "Sale for {{saleInfo}} updated successfully!": "¡Venta para {{saleInfo}} actualizada con éxito!",
      "Sale for {{saleInfo}} added successfully!": "¡Venta para {{saleInfo}} añadida con éxito!",
      "Failed to {{action}} sale for {{saleInfo}}": "Error al {{action}} la venta para {{saleInfo}}",
      "Sale for {{saleInfo}} deleted successfully!": "¡Venta para {{saleInfo}} eliminada con éxito!",
      "Failed to delete sale for {{saleInfo}}": "Error al eliminar la venta para {{saleInfo}}",
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