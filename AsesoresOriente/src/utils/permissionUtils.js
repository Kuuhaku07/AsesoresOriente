// Utility functions for role and permission checks based on role names

// Return the role name as is or map if needed
export function getRoleName(role) {
  if (!role) return "VISITANTE";
  return role.toUpperCase();
}

// Check if user has one of the roles in rolesArray (array of strings)
export function hasRole(user, rolesArray) {
  if (!user || !user.role) return false;
  const userRole = user.role.toUpperCase();
  return rolesArray.map(r => r.toUpperCase()).includes(userRole);
}

// Check if user is ADMINISTRADOR
export function isAdmin(user) {
  return hasRole(user, ["ADMINISTRADOR"]);
}

// Check if user is GERENTE
export function isManager(user) {
  return hasRole(user, ["GERENTE"]);
}

// Check if user is ASESOR
export function isAdvisor(user) {
  return hasRole(user, ["ASESOR"]);
}

// Check if user is VISITANTE (no role)
export function isVisitor(user) {
  return !user || !user.role;
}

// Verify login and redirect if not logged in
// navigate is a function to redirect, showError is a callback to show error messages (e.g. ToastMessage)
export function verifyLogin(user, navigate, showError) {
  if (!user) {
    if (showError) showError('Debe iniciar sesión para acceder');
    if (navigate) navigate('/');
    return false;
  }
  return true;
}

// Verify permissions and redirect or show error if unauthorized
export function verifyPermissions(user, requiredRoles = [], navigate, showError) {
  if (!user || !hasRole(user, requiredRoles)) {
    if (showError) showError('No tiene permisos para acceder a esta sección');
    if (navigate) navigate('/');
    return false;
  }
  return true;
}

// Verify admin action permissions, returns boolean or shows error
export function verifyAdminAction(user, showError) {
  if (!user || !isAdmin(user)) {
    if (showError) showError('No tiene permisos para realizar esta acción');
    return false;
  }
  return true;
}

// Verify super admin permissions, returns boolean or shows error
export function verifySuperAdmin(user, showError) {
  if (!user || user.role.toUpperCase() !== 'SUPER ADMINISTRADOR') {
    if (showError) showError('Esta acción requiere permisos de Super Administrador');
    return false;
  }
  return true;
}
