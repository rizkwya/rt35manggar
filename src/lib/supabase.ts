import { createClient } from '@supabase/supabase-js';
import { 
  NewsPost, 
  PresensiRecord, 
  ProkerItem, 
  TeamMember, 
  UserProfile, 
  UserRole, 
  RTDemographics, 
  RTAnnouncement, 
  RTPengurus,
  RTSettings,
  NavigationItem,
  RTFacility
} from '../types/database';
import { 
  INITIAL_DEMOGRAPHICS, 
  INITIAL_SETTINGS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_PENGURUS, 
  INITIAL_KKN_TEAM, 
  INITIAL_PROKER,
  INITIAL_NAV_ITEMS,
  INITIAL_FACILITIES
} from './initialData';

// Re-export initial data constants so all component imports remain intact
export * from './initialData';

// PRODUCTION SUPABASE ENVIRONMENT CONFIGURATION
export const SUPABASE_URL = 
  (import.meta as any).env?.VITE_SUPABASE_URL || 'https://atmqjbhrillqeehblizb.supabase.co';

export const SUPABASE_ANON_KEY = 
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 
  'sb_publishable_SSBgwLT0rUpEm8n0qDYaFw_Qp1vIm7G';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DYNAMIC DATA SERVICE INTERACTION
export const SupabaseService = {
  async authenticateUser(inputKey: string, passKey: string): Promise<UserProfile | null> {
    const trimmedInput = inputKey.trim().toLowerCase();
    const trimmedPass = passKey.trim();

    let targetEmail = trimmedInput;
    if (trimmedInput === 'sekretaris') {
      targetEmail = 'sekretaris@rt35.id';
    } else if (/^\d+$/.test(trimmedInput)) {
      targetEmail = `${trimmedInput}@fasilkom.ac.id`;
    }

    try {
      // Try official Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password: trimmedPass
      });

      if (authData?.user && !authError) {
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('email', authData.user.email)
          .single();

        if (profile && !profileError) {
          let role: UserRole = 'mahasiswa';
          if (profile.role === 'sekretaris_rt') role = 'sekretaris_rt';
          if (profile.role === 'developer' || profile.is_developer) role = 'developer';

          return {
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name || profile.name,
            role: role,
            prodi: profile.prodi,
            nim: profile.nim,
            avatar_url: profile.avatar_url,
          };
        }
      }
    } catch (err) {
      console.error('Supabase Auth error:', err);
    }

    return null;
  },

  async updateUserProfile(profile: UserProfile): Promise<UserProfile> {
    try {
      const dbObj = {
        id: profile.id,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        email: profile.email,
        nim: profile.nim,
        prodi: profile.prodi,
        phone: profile.phone,
        role: profile.role
      };
      const { error } = await supabase.from('users').upsert([dbObj]);
      if (error) throw error;
    } catch (e) {
      console.warn('User profile update error:', e);
    }
    return profile;
  },

  // DEMOGRAPHICS DATA CRUD
  async fetchDemographics(): Promise<RTDemographics> {
    try {
      const { data, error } = await supabase.from('rt_demographics').select('*').single();
      if (data && !error) {
        return { ...INITIAL_DEMOGRAPHICS, ...data } as RTDemographics;
      }
    } catch (e) {
      console.error('Demographics query error:', e);
    }
    return INITIAL_DEMOGRAPHICS;
  },

  async updateDemographics(demographics: RTDemographics): Promise<RTDemographics> {
    const updatedObj = { ...demographics, updated_at: new Date().toISOString() };
    try {
      await supabase.from('rt_demographics').upsert([updatedObj]);
    } catch (e) {
      console.warn('Demographics update error:', e);
    }
    return updatedObj;
  },

  // ANNOUNCEMENTS CRUD
  async fetchAnnouncements(): Promise<RTAnnouncement[]> {
    try {
      const { data, error } = await supabase.from('rt_announcements').select('*').order('date', { ascending: false });
      if (data && !error) {
        return data as RTAnnouncement[];
      }
    } catch (e) {
      console.warn('Announcements query error:', e);
    }
    return [];
  },

  async addAnnouncement(item: RTAnnouncement): Promise<RTAnnouncement[]> {
    try {
      await supabase.from('rt_announcements').insert([item]);
    } catch (e) {
      console.warn('Announcement insert error:', e);
    }
    return this.fetchAnnouncements();
  },

  async deleteAnnouncement(id: string): Promise<RTAnnouncement[]> {
    try {
      await supabase.from('rt_announcements').delete().eq('id', id);
    } catch (e) {
      console.warn('Announcement delete error:', e);
    }
    return this.fetchAnnouncements();
  },

  // NEWS CRUD
  async fetchNews(): Promise<NewsPost[]> {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
      if (data && !error) {
        return data as NewsPost[];
      }
    } catch (e) {
      console.warn('News query error:', e);
    }
    return [];
  },

  async addNews(item: any): Promise<NewsPost[]> {
    try {
      await supabase.from('news').insert([item]);
    } catch (e) {
      console.warn('News insert error:', e);
    }
    return this.fetchNews();
  },

  async updateNews(item: any): Promise<NewsPost[]> {
    try {
      await supabase.from('news').update(item).eq('id', item.id);
    } catch (e) {
      console.warn('News update error:', e);
    }
    return this.fetchNews();
  },

  async deleteNews(id: string): Promise<NewsPost[]> {
    try {
      await supabase.from('news').delete().eq('id', id);
    } catch (e) {
      console.warn('News delete error:', e);
    }
    return this.fetchNews();
  },

  // PENGURUS CRUD
  async fetchPengurus(): Promise<RTPengurus[]> {
    try {
      const { data, error } = await supabase.from('rt_pengurus').select('*').order('created_at', { ascending: true });
      if (error) throw error;
      return (data || []) as RTPengurus[];
    } catch (e) {
      console.error('Pengurus query error:', e);
      throw e;
    }
  },

  async updatePengurus(item: RTPengurus): Promise<RTPengurus[]> {
    try {
      const { error } = await supabase.from('rt_pengurus').upsert([item]);
      if (error) throw error;
      return this.fetchPengurus();
    } catch (e) {
      console.error('Pengurus update error:', e);
      throw e;
    }
  },

  async deletePengurus(id: string): Promise<RTPengurus[]> {
    try {
      const { error } = await supabase.from('rt_pengurus').delete().eq('id', id);
      if (error) throw error;
      return this.fetchPengurus();
    } catch (e) {
      console.error('Pengurus delete error:', e);
      throw e;
    }
  },

  // KKN TEAM MEMBERS CRUD
  async fetchKKNTeam(): Promise<TeamMember[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'mahasiswa');
      if (data && !error) {
        return data.map((d) => ({
          id: d.id,
          name: d.full_name,
          nim: d.nim,
          prodi: d.prodi,
          role_kkn: d.role_kkn || 'Mahasiswa KKN',
          avatar_url: d.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          email: d.email,
        }));
      }
    } catch (e) {
      console.warn('KKN Team query error:', e);
    }
    return [];
  },

  async updateKKNTeamMember(member: TeamMember): Promise<TeamMember[]> {
    try {
      const dbObj = {
        id: member.id,
        full_name: member.name,
        nim: member.nim,
        prodi: member.prodi,
        avatar_url: member.avatar_url,
        email: member.email || `${member.nim}@fasilkom.ac.id`,
      };
      await supabase.from('users').upsert([dbObj]);
    } catch (e) {
      console.warn('KKN Team update error:', e);
    }
    return this.fetchKKNTeam();
  },

  async deleteKKNTeamMember(id: string): Promise<TeamMember[]> {
    try {
      await supabase.from('users').delete().eq('id', id);
    } catch (e) {
      console.warn('KKN Team member delete error:', e);
    }
    return this.fetchKKNTeam();
  },

  // PROKER KKN CRUD
  async fetchProker(): Promise<ProkerItem[]> {
    try {
      const { data, error } = await supabase.from('proker').select('*');
      if (data && !error) {
        return data as ProkerItem[];
      }
    } catch (e) {
      console.warn('Proker query error:', e);
    }
    return [];
  },

  async updateProker(item: ProkerItem): Promise<ProkerItem[]> {
    try {
      await supabase.from('proker').upsert([item]);
    } catch (e) {
      console.warn('Proker update error:', e);
    }
    return this.fetchProker();
  },

  async deleteProker(id: string): Promise<ProkerItem[]> {
    try {
      await supabase.from('proker').delete().eq('id', id);
    } catch (e) {
      console.warn('Proker delete error:', e);
    }
    return this.fetchProker();
  },

  // PRESENSI KKN CRUD
  async fetchPresensi(): Promise<PresensiRecord[]> {
    try {
      const { data, error } = await supabase.from('presensi').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0 && !error) {
        return data as PresensiRecord[];
      }
    } catch (e) {
      console.warn('Presensi query error:', e);
    }
    return [];
  },

  async addPresensi(record: PresensiRecord): Promise<PresensiRecord[]> {
    try {
      await supabase.from('presensi').insert([record]);
    } catch (e) {
      console.warn('Presensi insert error:', e);
    }
    return this.fetchPresensi();
  },

  // PORTAL SETTINGS CRUD
  async fetchSettings(): Promise<RTSettings> {
    try {
      const { data, error } = await supabase.from('rt_settings').select('*');
      if (data && data.length > 0 && !error) {
        const firstRow = data[0];
        let maps_coordinate = '';
        let syarat_surat = '';
        let kontak_darurat = '';
        let emergency_title = firstRow.emergency_title || '';
        let emergency_description = '';
        
        let vision = '';
        let mission = '';
        let history = '';
        let boundary_north = '';
        let boundary_south = '';
        let boundary_east = '';
        let boundary_west = '';

        if (firstRow.emergency_description) {
          try {
            const extra = JSON.parse(firstRow.emergency_description);
            maps_coordinate = extra.maps_coordinate || '';
            syarat_surat = extra.syarat_surat || '';
            kontak_darurat = extra.kontak_darurat || '';
            emergency_description = extra.emergency_description || '';
            
            if (extra.vision) vision = extra.vision;
            if (extra.mission) mission = extra.mission;
            if (extra.history) history = extra.history;
            if (extra.boundary_north) boundary_north = extra.boundary_north;
            if (extra.boundary_south) boundary_south = extra.boundary_south;
            if (extra.boundary_east) boundary_east = extra.boundary_east;
            if (extra.boundary_west) boundary_west = extra.boundary_west;
          } catch (jsonErr) {
            console.warn('Failed to parse emergency_description as JSON:', jsonErr);
            emergency_description = firstRow.emergency_description;
          }
        }
        return {
          ...firstRow,
          emergency_title,
          emergency_description,
          maps_coordinate,
          syarat_surat,
          kontak_darurat,
          vision,
          mission,
          history,
          boundary_north,
          boundary_south,
          boundary_east,
          boundary_west
        } as RTSettings;
      }
    } catch (e) {
      console.error('Settings query error:', e);
    }
    
    return INITIAL_SETTINGS;
  },

  async updateSettings(settings: RTSettings): Promise<RTSettings> {
    let existingId = settings.id;
    try {
      const { data } = await supabase.from('rt_settings').select('id');
      if (data && data.length > 0) {
        existingId = data[0].id;
      }
    } catch (e) {
      console.warn('Failed to fetch existing settings ID:', e);
    }

    const extra = {
      maps_coordinate: settings.maps_coordinate || '',
      syarat_surat: settings.syarat_surat || '',
      kontak_darurat: settings.kontak_darurat || '',
      emergency_description: settings.emergency_description || '',
      vision: settings.vision || '',
      mission: settings.mission || '',
      history: settings.history || '',
      boundary_north: settings.boundary_north || '',
      boundary_south: settings.boundary_south || '',
      boundary_east: settings.boundary_east || '',
      boundary_west: settings.boundary_west || ''
    };
    const dbObj: any = {
      portal_name: settings.portal_name,
      portal_description: settings.portal_description,
      address: settings.address,
      address_detail: settings.address_detail,
      service_hours: settings.service_hours,
      phone_secretary: settings.phone_secretary,
      emergency_title: settings.emergency_title || '',
      emergency_description: JSON.stringify(extra),
      updated_at: new Date().toISOString()
    };
    if (existingId) {
      dbObj.id = existingId;
    }

    try {
      const { data, error } = await supabase.from('rt_settings').upsert([dbObj]).select();
      if (data && data.length > 0 && !error) {
        return {
          ...settings,
          ...extra,
          id: data[0].id
        };
      }
    } catch (e) {
      console.warn('Settings update error:', e);
    }
    return {
      ...settings,
      ...extra,
      id: existingId
    };
  },

  // NAVIGATION MENU CRUD
  async fetchNavItems(): Promise<NavigationItem[]> {
    try {
      const { data, error } = await supabase
        .from('rt_navigation_items')
        .select('*')
        .order('order_index', { ascending: true });
      if (data && !error) {
        return data as NavigationItem[];
      }
    } catch (e) {
      console.warn('Navigation items query error:', e);
    }
    return [];
  },

  async saveNavItems(items: NavigationItem[]): Promise<NavigationItem[]> {
    const { error } = await supabase.from('rt_navigation_items').upsert(items);
    if (error) {
      console.warn('Navigation items upsert error:', error);
      throw new Error(error.message || 'Gagal menyimpan menu navigasi.');
    }
    return this.fetchNavItems();
  },

  async deleteNavItem(id: string): Promise<NavigationItem[]> {
    const { error } = await supabase.from('rt_navigation_items').delete().eq('id', id);
    if (error) {
      console.warn('Navigation item delete error:', error);
      throw new Error(error.message || 'Gagal menghapus menu navigasi.');
    }
    return this.fetchNavItems();
  },

  async uploadImage(file: File, folder: string = 'images'): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('rt-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.warn('Storage upload error:', error);
      throw new Error(error.message || 'Gagal mengunggah ke storage.');
    }

    const { data: publicData } = supabase.storage
      .from('rt-assets')
      .getPublicUrl(filePath);
 
    if (!publicData || !publicData.publicUrl) {
      throw new Error('Gagal mendapatkan URL publik gambar.');
    }
 
    return publicData.publicUrl;
  },

  // FACILITIES CRUD
  async fetchFacilities(): Promise<RTFacility[]> {
    try {
      const { data, error } = await supabase
        .from('rt_facilities')
        .select('*')
        .order('created_at', { ascending: true });
      if (data && !error) {
        return data as RTFacility[];
      }
    } catch (e) {
      console.error('Facilities query error:', e);
    }
    return [];
  },

  async updateFacility(facility: RTFacility): Promise<RTFacility[]> {
    try {
      const { error } = await supabase.from('rt_facilities').upsert([facility]);
      if (error) throw error;
    } catch (e) {
      console.warn('Facility update error:', e);
    }
    return this.fetchFacilities();
  },

  async deleteFacility(id: string): Promise<RTFacility[]> {
    try {
      const { error } = await supabase.from('rt_facilities').delete().eq('id', id);
      if (error) throw error;
    } catch (e) {
      console.warn('Facility delete error:', e);
    }
    return this.fetchFacilities();
  }
};
