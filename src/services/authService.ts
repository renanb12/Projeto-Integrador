import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      const data = response.data;
      this.setAuthData(data);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    }
  },

  async register(data: RegisterData): Promise<void> {
    try {
      await api.post('/auth/register', data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao registrar usuário');
    }
  },

  async updateUser(data: UpdateUserData): Promise<{ user: AuthResponse['user'] }> {
    try {
      const response = await api.put('/auth/update', data);
      const updatedUser = response.data.user;
      
      // Update stored user data
      const currentData = this.getAuthData();
      this.setAuthData({
        token: currentData.token,
        user: updatedUser
      });
      
      return { user: updatedUser };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar usuário');
    }
  },

  setAuthData(data: AuthResponse) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  },

  getAuthData() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return { token, user };
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  },

  isAuthenticated(): boolean {
    const { token, user } = this.getAuthData();
    return !!(token && user);
  }
};