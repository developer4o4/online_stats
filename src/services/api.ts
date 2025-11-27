export interface StatisticsData {
  total: {
    all_users: number;
    all_male: number;
    all_female: number;
  };
  directions: {
    rfutbol: {
      name: string;
      total: number;
      male: number;
      female: number;
    };
    rsumo: {
      name: string;
      total: number;
      male: number;
      female: number;
    };
    fixtirolar: {
      name: string;
      total: number;
      male: number;
      female: number;
    };
    ai: {
      name: string;
      total: number;
      male: number;
      female: number;
    };
    contest: {
      name: string;
      total: number;
      male: number;
      female: number;
    };
  };
}

// Token response interface
interface TokenResponse {
  token: string;
  user_id: number;
  email: string;
  is_staff: boolean;
}

class ApiService {
  private baseURL = 'http://127.0.0.1:8000';
  private token: string | null = null;
  private username = 'root';
  private password = '12';

  // Token olish
  async getToken(): Promise<string> {
    if (this.token) {
      return this.token;
    }

    try {
      console.log('Token olinmoqda...');
      
      const response = await fetch(`${this.baseURL}/api-token-auth/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
      });

      console.log('Token response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Token olish muvaffaqiyatsiz: ${response.status} - ${errorText}`);
      }

      const data: TokenResponse = await response.json();
      console.log('Token olindi:', data);
      
      if (!data.token) {
        throw new Error('Token response da token mavjud emas');
      }
      
      this.token = data.token;
      return this.token;

    } catch (error) {
      console.error('Token olishda xatolik:', error);
      throw error;
    }
  }

  // Token bilan so'rov yuborish
  private async makeAuthenticatedRequest(url: string): Promise<Response> {
    const token = await this.getToken();
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response;
  }

  async getStatistics(): Promise<StatisticsData> {
    try {
      console.log('=== TOKEN AUTHENTICATION ===');
      
      const response = await this.makeAuthenticatedRequest(`${this.baseURL}/statistics/`);
      console.log('Statistics response status:', response.status);

      if (response.status === 401) {
        // Token eskirgan bo'lishi mumkin, yangilaymiz
        this.token = null;
        const newResponse = await this.makeAuthenticatedRequest(`${this.baseURL}/statistics/`);
        
        if (!newResponse.ok) {
          const errorText = await newResponse.text();
          throw new Error(`Authentication failed after token refresh: ${newResponse.status} - ${errorText}`);
        }
        
        const data: StatisticsData = await newResponse.json();
        return data;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: StatisticsData = await response.json();
      console.log('Statistics data received:', data);
      return data;

    } catch (error) {
      console.error('Get statistics error:', error);
      throw error;
    }
  }

  // Test uchun connection
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('Testing token authentication...');
      
      // Avval token olishni test qilamiz
      try {
        const token = await this.getToken();
        console.log('Token mavjud:', !!token);
      } catch (tokenError) {
        return { 
          success: false, 
          message: `Token olishda xatolik: ${tokenError instanceof Error ? tokenError.message : 'Noma\'lum xatolik'}` 
        };
      }

      // Keyin statistics endpoint ni test qilamiz
      const response = await this.makeAuthenticatedRequest(`${this.baseURL}/statistics/`);
      
      if (response.ok) {
        return { success: true, message: 'Token authentication muvaffaqiyatli!' };
      } else {
        const errorText = await response.text();
        return { 
          success: false, 
          message: `Server xatosi: ${response.status} ${response.statusText} - ${errorText}` 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: `Xatolik: ${error instanceof Error ? error.message : 'Noma\'lum xatolik'}` 
      };
    }
  }

  // Login sahifasiga yo'naltirish
  redirectToLogin(): void {
    window.open(`${this.baseURL}/admin/`, '_blank', 'noopener,noreferrer');
  }

  // Token ni tozalash
  clearToken(): void {
    this.token = null;
    console.log('Token tozalandi');
  }

  // Token mavjudligini tekshirish
  hasToken(): boolean {
    return this.token !== null;
  }
}

export const apiService = new ApiService();