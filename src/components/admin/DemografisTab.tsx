import React, { useState, useEffect } from 'react';
import { 
  Save, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Edit, 
  Users, 
  FileText, 
  ChevronRight, 
  GraduationCap, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  AlertCircle, 
  ArrowLeft,
  User,
  Heart,
  LogOut,
  Sparkles
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, AreaChart, Area, CartesianGrid, Legend } from 'recharts';
import { RTDemographics, RTSettings, KKRecord, KKMember } from '../../types/database';
import { SupabaseService, supabase } from '../../lib/supabase';
import { INITIAL_DEMOGRAPHICS } from '../../lib/initialData';

interface DemografisTabProps {
  initialDemographics: RTDemographics | null;
  onUpdateDemographics: (data: RTDemographics) => void;
  showSuccess: (msg: string) => void;
  settings?: RTSettings;
  onSettingsUpdate?: (settings: RTSettings) => void;
}

export const DemografisTab: React.FC<DemografisTabProps> = ({
  initialDemographics,
  onUpdateDemographics,
  showSuccess,
  settings,
  onSettingsUpdate
}) => {
  const [loading, setLoading] = useState(false);
  const [demographics, setDemographics] = useState<RTDemographics | null>(initialDemographics || INITIAL_DEMOGRAPHICS);
  
  // KK list state loaded from settings
  const [kkList, setKkList] = useState<KKRecord[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'database' | 'visualisasi'>('database');
  
  // Filter for displaying inactive/moved citizens
  const [showInactive, setShowInactive] = useState(false);
  
  // UI states for managing KK
  const [selectedKkId, setSelectedKkId] = useState<string | null>(null);
  
  // KK Form states
  const [newNoKk, setNewNoKk] = useState('');
  const [newKepala, setNewKepala] = useState('');
  const [newIncome, setNewIncome] = useState<'under_2m' | '2m_5m' | '5m_10m' | 'above_10m'>('under_2m');
  const [editingKkId, setEditingKkId] = useState<string | null>(null);

  // Member Form states
  const [showAddMember, setShowAddMember] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [memberName, setMemberName] = useState('');
  const [memberNik, setMemberNik] = useState('');
  const [memberGender, setMemberGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [memberBirthDate, setMemberBirthDate] = useState('');
  const [memberEducation, setMemberEducation] = useState<'SD' | 'SMP' | 'SMA' | 'Sarjana/Diploma' | 'Tidak Sekolah'>('Tidak Sekolah');
  const [memberJob, setMemberJob] = useState<'PNS' | 'Swasta' | 'Wiraswasta' | 'Nelayan' | 'Lainnya'>('Lainnya');
  const [memberRegDate, setMemberRegDate] = useState('');
  const [memberIsUmkm, setMemberIsUmkm] = useState(false);
  const [memberUmkmName, setMemberUmkmName] = useState('');
  const [memberStatus, setMemberStatus] = useState<'Aktif' | 'Keluar' | 'Meninggal'>('Aktif');
  const [memberExitDate, setMemberExitDate] = useState('');
  const [memberExitReason, setMemberExitReason] = useState<'Pindah' | 'Meninggal' | 'Lainnya'>('Pindah');
  const [selectedTrendYear, setSelectedTrendYear] = useState<number>(new Date().getFullYear());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [searchKk, setSearchKk] = useState('');

  // Load KK and members directly from Supabase tables
  const loadKkData = async (showLoadingSpinner = true) => {
    if (showLoadingSpinner) setLoading(true);
    try {
      const { data: cardsData, error: cardsErr } = await supabase
        .from('family_cards')
        .select('*');

      if (cardsData && !cardsErr) {
        // If SQL tables are empty but legacy JSON settings contain KK data, perform auto-migration
        if (cardsData.length === 0 && settings?.kk_list && settings.kk_list.length > 0) {
          console.log("Migrating legacy JSON KK records to Supabase SQL tables...");
          for (const kk of settings.kk_list) {
            const { data: savedCard, error: cardErr } = await supabase
              .from('family_cards')
              .insert([{
                no_kk: kk.no_kk,
                kepala_keluarga: kk.kepala_keluarga,
                alamat: kk.alamat || 'RT 35 Manggar',
                rt_rw: kk.rt_rw || '035/000',
                income: kk.income
              }])
              .select()
              .single();

            if (!cardErr && savedCard) {
              const cardId = savedCard.id;
              if (kk.members && kk.members.length > 0) {
                const membersPayload = kk.members.map((m) => ({
                  family_card_id: cardId,
                  nik: m.nik,
                  nama: m.name,
                  hubungan: m.relationship || 'Anak',
                  jenis_kelamin: m.gender === 'Perempuan' ? 'Perempuan' : 'Laki-laki',
                  tanggal_lahir: m.birthDate || null,
                  pendidikan: m.education || 'Tidak Sekolah',
                  pekerjaan: m.job || 'Lainnya',
                  is_umkm: m.isUmkm || false,
                  umkm_name: m.umkmName || '',
                  status: m.status || 'Aktif',
                  reg_date: m.registrationDate || '',
                  exit_date: m.exitDate || '',
                  exit_reason: m.exitReason || null
                }));
                await supabase.from('family_members').insert(membersPayload);
              }
            }
          }
          // Reload from database after migration
          const { data: freshCards } = await supabase
            .from('family_cards')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (freshCards) {
            const compiledList: KKRecord[] = await Promise.all(
              freshCards.map(async (c: any) => {
                const { data: membersData } = await supabase
                  .from('family_members')
                  .select('*')
                  .eq('family_card_id', c.id)
                  .order('created_at', { ascending: true });

                const mappedMembers: KKMember[] = (membersData || []).map((m: any) => ({
                  id: m.id,
                  name: m.nama,
                  nik: m.nik,
                  gender: m.jenis_kelamin,
                  birthDate: m.tanggal_lahir || '',
                  education: m.pendidikan || 'Tidak Sekolah',
                  job: m.pekerjaan || 'Lainnya',
                  relationship: m.hubungan,
                  isUmkm: m.is_umkm || false,
                  umkmName: m.umkm_name || '',
                  status: m.status || 'Aktif',
                  registrationDate: m.reg_date || '',
                  exitDate: m.exit_date || '',
                  exitReason: m.exit_reason || undefined
                }));

                return {
                  id: c.id,
                  no_kk: c.no_kk,
                  kepala_keluarga: c.kepala_keluarga,
                  income: c.income || 'under_2m',
                  rt_rw: c.rt_rw || '035/000',
                  alamat: c.alamat || 'RT 35 Manggar',
                  members: mappedMembers
                };
              })
            );
            setKkList(compiledList);
          }
          return;
        }

        const compiledList: KKRecord[] = await Promise.all(
          cardsData.map(async (c: any) => {
            const { data: membersData, error: membersErr } = await supabase
              .from('family_members')
              .select('*')
              .eq('family_card_id', c.id)
              .order('created_at', { ascending: true });

            const mappedMembers: KKMember[] = (membersData || []).map((m: any) => ({
              id: m.id,
              name: m.nama,
              nik: m.nik,
              gender: m.jenis_kelamin,
              birthDate: m.tanggal_lahir || '',
              education: m.pendidikan || 'Tidak Sekolah',
              job: m.pekerjaan || 'Lainnya',
              relationship: m.hubungan,
              isUmkm: m.is_umkm || false,
              umkmName: m.umkm_name || '',
              status: m.status || 'Aktif',
              registrationDate: m.reg_date || '',
              exitDate: m.exit_date || '',
              exitReason: m.exit_reason || undefined
            }));

            return {
              id: c.id,
              no_kk: c.no_kk,
              kepala_keluarga: c.kepala_keluarga,
              income: c.income || 'under_2m',
              rt_rw: c.rt_rw || '035/000',
              alamat: c.alamat || 'RT 35 Manggar',
              members: mappedMembers
            };
          })
        );
        setKkList(compiledList);
      }
    } catch (err) {
      console.error('Failed loading family data:', err);
    } finally {
      if (showLoadingSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    loadKkData();

    // Supabase Realtime Subscription
    const channel = supabase
      .channel('demografis-realtime-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'family_cards' },
        () => {
          loadKkData(false); // Fetch silently in the background
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'family_members' },
        () => {
          loadKkData(false); // Fetch silently in the background
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rt_demographics' },
        async () => {
          // Fetch updated demographics silently
          const { data } = await supabase.from('rt_demographics').select('*').single();
          if (data) {
            setDemographics(data);
            onUpdateDemographics(data);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (initialDemographics) {
      setDemographics(initialDemographics);
    }
  }, [initialDemographics]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchKk, kkList]);

  const filteredKkList = kkList.filter(kk => 
    kk.no_kk.includes(searchKk) ||
    kk.kepala_keluarga.toLowerCase().includes(searchKk.toLowerCase())
  );

  // Helper to sync a single KK card and its members to Supabase database tables
  const syncCardToDatabase = async (kk: KKRecord) => {
    const isExistingCard = kk.id && kk.id.includes('-');
    const cardPayload: any = {
      no_kk: kk.no_kk,
      kepala_keluarga: kk.kepala_keluarga,
      alamat: kk.alamat || 'RT 35 Manggar',
      rt_rw: kk.rt_rw || '035/000',
      income: kk.income
    };
    if (isExistingCard) {
      cardPayload.id = kk.id;
    }

    const { data: savedCard, error: cardErr } = await supabase
      .from('family_cards')
      .upsert([cardPayload])
      .select()
      .single();

    if (cardErr) throw cardErr;
    const cardId = savedCard.id;
    kk.id = cardId; // update the in-memory record id with the UUID from database

    // Sync members of this card
    const dbMembersRes = await supabase.from('family_members').select('id').eq('family_card_id', cardId);
    const oldMemberIds = (dbMembersRes.data || []).map(m => m.id);
    const currentMemberIds = kk.members.map(m => m.id).filter(id => id.includes('-'));
    const deletedMemberIds = oldMemberIds.filter(id => !currentMemberIds.includes(id));

    // Handle member deletions
    for (const id of deletedMemberIds) {
      await supabase.from('family_members').delete().eq('id', id);
    }

    // Upsert active members
    for (const m of kk.members) {
      const isExistingMember = m.id && m.id.includes('-');
      const memberPayload: any = {
        family_card_id: cardId,
        nik: m.nik,
        nama: m.name,
        hubungan: m.relationship,
        jenis_kelamin: m.gender,
        tanggal_lahir: m.birthDate || null,
        pendidikan: m.education,
        pekerjaan: m.job,
        is_umkm: m.isUmkm || false,
        umkm_name: m.umkmName || '',
        status: m.status || 'Aktif',
        reg_date: m.registrationDate || '',
        exit_date: m.exitDate || '',
        exit_reason: m.exitReason || null
      };
      if (isExistingMember) {
        memberPayload.id = m.id;
      }
      const { data: savedMember, error: memErr } = await supabase
        .from('family_members')
        .upsert([memberPayload])
        .select()
        .single();
      if (memErr) throw memErr;
      m.id = savedMember.id; // update the in-memory member id with the UUID
    }
  };

  const deleteCardFromDatabase = async (id: string) => {
    if (id.includes('-')) {
      const { error } = await supabase.from('family_cards').delete().eq('id', id);
      if (error) throw error;
    }
  };

  // Recalculate demographic stats from the current KK list and save to Supabase
  const recalculateAndSave = async (updatedList: KKRecord[]) => {
    setLoading(true);
    try {
      // 1. Update local list state
      setKkList(updatedList);

      // 2. Perform demographic calculations
      let total_kk = updatedList.length;
      let total_pria = 0;
      let total_wanita = 0;
      let total_balita = 0;
      let total_lansia = 0;
      let total_usia_produktif = 0;
      let total_umkm = 0;
      
      let income_under_2m = 0;
      let income_2m_to_5m = 0;
      let income_5m_to_10m = 0;
      let income_above_10m = 0;

      let edu_sd = 0;
      let edu_smp = 0;
      let edu_sma = 0;
      let edu_pt = 0;
      let edu_tidak_sekolah = 0;

      let prof_pns = 0;
      let prof_swasta = 0;
      let prof_wiraswasta = 0;
      let prof_nelayan = 0;
      let prof_lainnya = 0;

      let warga_baru_jan = 0;
      let warga_baru_feb = 0;
      let warga_baru_mar = 0;
      let warga_baru_apr = 0;
      let warga_baru_mei = 0;
      let warga_baru_jun = 0;
      let warga_baru_jul = 0;
      let warga_baru_agu = 0;
      let warga_baru_sep = 0;
      let warga_baru_okt = 0;
      let warga_baru_nov = 0;
      let warga_baru_des = 0;

      updatedList.forEach(kk => {
        // Count incomes per KK
        if (kk.income === 'under_2m') income_under_2m++;
        else if (kk.income === '2m_5m') income_2m_to_5m++;
        else if (kk.income === '5m_10m') income_5m_to_10m++;
        else if (kk.income === 'above_10m') income_above_10m++;

        kk.members.forEach(m => {
          if (m.registrationDate) {
            const regDate = new Date(m.registrationDate);
            if (!isNaN(regDate.getTime())) {
              const month = regDate.getMonth();
              if (month === 0) warga_baru_jan++;
              else if (month === 1) warga_baru_feb++;
              else if (month === 2) warga_baru_mar++;
              else if (month === 3) warga_baru_apr++;
              else if (month === 4) warga_baru_mei++;
              else if (month === 5) warga_baru_jun++;
              else if (month === 6) warga_baru_jul++;
              else if (month === 7) warga_baru_agu++;
              else if (month === 8) warga_baru_sep++;
              else if (month === 9) warga_baru_okt++;
              else if (month === 10) warga_baru_nov++;
              else if (month === 11) warga_baru_des++;
            }
          }

          if (!m.status || m.status === 'Aktif') {
            if (m.gender === 'Laki-laki') total_pria++;
            else total_wanita++;

            if (m.birthDate) {
              const birthYear = new Date(m.birthDate).getFullYear();
              const currentYear = new Date().getFullYear();
              const age = currentYear - birthYear;
              if (age < 5) total_balita++;
              else if (age > 60) total_lansia++;
              
              if (age >= 15 && age <= 60) total_usia_produktif++;
            }

            if (m.education === 'SD') edu_sd++;
            else if (m.education === 'SMP') edu_smp++;
            else if (m.education === 'SMA') edu_sma++;
            else if (m.education === 'Sarjana/Diploma') edu_pt++;
            else edu_tidak_sekolah++;

            if (m.job === 'PNS') prof_pns++;
            else if (m.job === 'Swasta') prof_swasta++;
            else if (m.job === 'Wiraswasta') prof_wiraswasta++;
            else if (m.job === 'Nelayan') prof_nelayan++;
            else prof_lainnya++;

            if (m.isUmkm) total_umkm++;
          }
        });
      });

      const total_warga = total_pria + total_wanita;

      // 3. Save calculated demographics stats
      if (demographics) {
        const updatedDemo: RTDemographics = {
          ...demographics,
          total_kk,
          total_pria,
          total_wanita,
          total_warga,
          total_balita,
          total_lansia,
          total_usia_produktif,
          total_umkm,
          income_under_2m,
          income_2m_to_5m,
          income_5m_to_10m,
          income_above_10m,
          edu_sd,
          edu_smp,
          edu_sma,
          edu_pt,
          edu_tidak_sekolah,
          prof_pns,
          prof_swasta,
          prof_wiraswasta,
          prof_nelayan,
          prof_lainnya,
          warga_baru_jan,
          warga_baru_feb,
          warga_baru_mar,
          warga_baru_apr,
          warga_baru_mei,
          warga_baru_jun,
          warga_baru_jul,
          warga_baru_agu,
          warga_baru_sep,
          warga_baru_okt,
          warga_baru_nov,
          warga_baru_des,
          updated_at: new Date().toISOString()
        };
        const savedDemo = await SupabaseService.updateDemographics(updatedDemo);
        setDemographics(savedDemo);
        onUpdateDemographics(savedDemo);
      }
      showSuccess('Database KK & statistik otomatis berhasil disinkronisasi!');
    } catch (err: any) {
      console.error('Recalculation error:', err);
      alert('Gagal mensinkronisasikan data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // KK Actions
  const handleAddOrEditKk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoKk.trim() || !newKepala.trim()) return;
    if (loading) return;

    // Duplication Check (No. KK)
    const kkExists = kkList.some(kk => kk.no_kk === newNoKk.trim() && kk.id !== editingKkId);
    if (kkExists) {
      alert(`Nomor Kartu Keluarga (KK) "${newNoKk.trim()}" sudah terdaftar dalam sistem! Periksa kembali.`);
      return;
    }

    let dirtyKk: KKRecord;
    let updated: KKRecord[];
    if (editingKkId) {
      const existing = kkList.find(kk => kk.id === editingKkId);
      if (!existing) return;
      dirtyKk = {
        ...existing,
        no_kk: newNoKk.trim(),
        kepala_keluarga: newKepala.trim(),
        income: newIncome
      };
      updated = kkList.map(kk => kk.id === editingKkId ? dirtyKk : kk);
      setEditingKkId(null);
    } else {
      dirtyKk = {
        id: Math.random().toString(36).substring(2, 9),
        no_kk: newNoKk.trim(),
        kepala_keluarga: newKepala.trim(),
        income: newIncome,
        members: []
      };
      updated = [...kkList, dirtyKk];
    }

    try {
      setLoading(true);
      await syncCardToDatabase(dirtyKk);
      await recalculateAndSave(updated);
      setNewNoKk('');
      setNewKepala('');
      setNewIncome('under_2m');
    } catch (err: any) {
      console.error("Gagal menambahkan KK:", err);
      alert("Gagal menambahkan KK: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditKkClick = (kk: KKRecord) => {
    setEditingKkId(kk.id);
    setNewNoKk(kk.no_kk);
    setNewKepala(kk.kepala_keluarga);
    setNewIncome(kk.income);
  };

  const handleDeleteKk = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus Kartu Keluarga ini? Semua anggota di dalamnya akan terhapus.')) return;
    try {
      setLoading(true);
      await deleteCardFromDatabase(id);
      const updated = kkList.filter(kk => kk.id !== id);
      if (selectedKkId === id) {
        setSelectedKkId(null);
      }
      await recalculateAndSave(updated);
    } catch (err: any) {
      console.error("Gagal menghapus KK:", err);
      alert("Gagal menghapus KK: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Member Actions
  const handleAddOrEditMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim() || !memberNik.trim() || !memberBirthDate) return;
    if (loading) return;

    // Duplication Check (NIK)
    const nikExists = kkList.some(kk => 
      kk.members.some(m => m.nik === memberNik.trim() && m.id !== editingMemberId)
    );
    if (nikExists) {
      alert(`NIK "${memberNik.trim()}" sudah terdaftar di sistem! Periksa kembali.`);
      return;
    }

    const targetKk = kkList.find(kk => kk.id === selectedKkId);
    if (!targetKk) return;

    const regDateStr = memberRegDate || new Date().toISOString().split('T')[0];
    const outDateStr = memberExitDate || '';

    let updatedMembers: KKMember[];
    if (editingMemberId) {
      updatedMembers = targetKk.members.map(m => {
        if (m.id === editingMemberId) {
          return {
            ...m,
            name: memberName.trim(),
            nik: memberNik.trim(),
            gender: memberGender,
            birthDate: memberBirthDate,
            education: memberEducation,
            job: memberJob,
            registrationDate: regDateStr,
            isUmkm: memberIsUmkm,
            umkmName: memberIsUmkm ? memberUmkmName.trim() : '',
            status: memberStatus,
            exitDate: memberStatus !== 'Aktif' ? outDateStr : '',
            exitReason: memberStatus !== 'Aktif' ? memberExitReason : undefined
          };
        }
        return m;
      });
      setEditingMemberId(null);
    } else {
      const newMember: KKMember = {
        id: Math.random().toString(36).substring(2, 9),
        name: memberName.trim(),
        nik: memberNik.trim(),
        gender: memberGender,
        birthDate: memberBirthDate,
        education: memberEducation,
        job: memberJob,
        registrationDate: regDateStr,
        isUmkm: memberIsUmkm,
        umkmName: memberIsUmkm ? memberUmkmName.trim() : '',
        status: memberStatus,
        exitDate: memberStatus !== 'Aktif' ? outDateStr : '',
        exitReason: memberStatus !== 'Aktif' ? memberExitReason : undefined
      };
      updatedMembers = [...targetKk.members, newMember];
    }

    const dirtyKk = { ...targetKk, members: updatedMembers };
    const updatedKkList = kkList.map(kk => {
      if (kk.id === selectedKkId) {
        return dirtyKk;
      }
      return kk;
    });

    try {
      setLoading(true);
      await syncCardToDatabase(dirtyKk);
      await recalculateAndSave(updatedKkList);
      setMemberName('');
      setMemberNik('');
      setMemberGender('Laki-laki');
      setMemberBirthDate('');
      setMemberEducation('Tidak Sekolah');
      setMemberJob('Lainnya');
      setMemberRegDate('');
      setMemberIsUmkm(false);
      setMemberUmkmName('');
      setMemberStatus('Aktif');
      setMemberExitDate('');
      setMemberExitReason('Pindah');
      setShowAddMember(false);
    } catch (err: any) {
      console.error("Gagal menambahkan anggota:", err);
      alert("Gagal menambahkan anggota: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditMemberClick = (m: KKMember) => {
    setEditingMemberId(m.id);
    setMemberName(m.name);
    setMemberNik(m.nik);
    setMemberGender(m.gender);
    setMemberBirthDate(m.birthDate);
    setMemberEducation(m.education);
    setMemberJob(m.job);
    setMemberRegDate(m.registrationDate || '');
    setMemberIsUmkm(!!m.isUmkm);
    setMemberUmkmName(m.umkmName || '');
    setMemberStatus(m.status || 'Aktif');
    setMemberExitDate(m.exitDate || '');
    setMemberExitReason(m.exitReason || 'Pindah');
    setShowAddMember(true);
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!window.confirm('Hapus anggota keluarga ini secara permanen dari database?')) return;
    const targetKk = kkList.find(kk => kk.id === selectedKkId);
    if (!targetKk) return;

    const dirtyKk = {
      ...targetKk,
      members: targetKk.members.filter(m => m.id !== memberId)
    };

    const updatedKkList = kkList.map(kk => {
      if (kk.id === selectedKkId) {
        return dirtyKk;
      }
      return kk;
    });

    try {
      setLoading(true);
      await syncCardToDatabase(dirtyKk);
      await recalculateAndSave(updatedKkList);
    } catch (err: any) {
      console.error("Gagal menghapus anggota:", err);
      alert("Gagal menghapus anggota: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!demographics) {
    return (
      <div className="p-8 text-center text-xs font-bold text-slate-400">
        Memuat data demografis...
      </div>
    );
  }

  // Get unique list of years from registration/exit dates in database, plus a standard 2020-future range
  const getAvailableTrendYears = () => {
    const yearsSet = new Set<number>();
    
    // Generate standard range from 2020 to current year + 5
    const currentYear = new Date().getFullYear();
    for (let y = 2020; y <= currentYear + 5; y++) {
      yearsSet.add(y);
    }

    kkList.forEach(kk => {
      kk.members.forEach(m => {
        if (m.registrationDate) {
          const d = new Date(m.registrationDate);
          if (!isNaN(d.getTime())) yearsSet.add(d.getFullYear());
        }
        if (m.exitDate) {
          const d = new Date(m.exitDate);
          if (!isNaN(d.getTime())) yearsSet.add(d.getFullYear());
        }
      });
    });

    return Array.from(yearsSet).sort((a, b) => b - a); // Descending order
  };

  // Get Monthly Trend Data dynamically including outgoing residents filtered by selected trend year
  const getMonthlyTrendData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const trend = months.map(m => ({ month: m, masuk: 0, keluar: 0 }));

    kkList.forEach(kk => {
      kk.members.forEach(m => {
        // Masuk
        if (m.registrationDate) {
          const regDate = new Date(m.registrationDate);
          if (!isNaN(regDate.getTime())) {
            const year = regDate.getFullYear();
            const monthIdx = regDate.getMonth();
            if (year === selectedTrendYear && monthIdx >= 0 && monthIdx < 12) {
              trend[monthIdx].masuk++;
            }
          }
        }
        // Keluar / Meninggal
        if ((m.status === 'Keluar' || m.status === 'Meninggal') && m.exitDate) {
          const outDate = new Date(m.exitDate);
          if (!isNaN(outDate.getTime())) {
            const year = outDate.getFullYear();
            const monthIdx = outDate.getMonth();
            if (year === selectedTrendYear && monthIdx >= 0 && monthIdx < 12) {
              trend[monthIdx].keluar++;
            }
          }
        }
      });
    });

    // Fallback if kkList is empty
    if (kkList.length === 0) {
      return [
        { month: 'Jan', masuk: demographics.warga_baru_jan || 0, keluar: 0 },
        { month: 'Feb', masuk: demographics.warga_baru_feb || 0, keluar: 0 },
        { month: 'Mar', masuk: demographics.warga_baru_mar || 0, keluar: 0 },
        { month: 'Apr', masuk: demographics.warga_baru_apr || 0, keluar: 0 },
        { month: 'Mei', masuk: demographics.warga_baru_mei || 0, keluar: 0 },
        { month: 'Jun', masuk: demographics.warga_baru_jun || 0, keluar: 0 },
        { month: 'Jul', masuk: demographics.warga_baru_jul || 0, keluar: 0 },
        { month: 'Agu', masuk: demographics.warga_baru_agu || 0, keluar: 0 },
        { month: 'Sep', masuk: demographics.warga_baru_sep || 0, keluar: 0 },
        { month: 'Okt', masuk: demographics.warga_baru_okt || 0, keluar: 0 },
        { month: 'Nov', masuk: demographics.warga_baru_nov || 0, keluar: 0 },
        { month: 'Des', masuk: demographics.warga_baru_des || 0, keluar: 0 },
      ];
    }

    return trend;
  };

  const trendData = getMonthlyTrendData();

  // Visualisation charts data parsing
  const genderData = [
    { name: 'Pria', value: demographics.total_pria || 0, color: '#1E4D6B' },
    { name: 'Wanita', value: demographics.total_wanita || 0, color: '#85A389' },
  ];

  const incomeData = [
    { range: 'Under 2M', KK: demographics.income_under_2m || 0 },
    { range: '2 - 5 Jt', KK: demographics.income_2m_to_5m || 0 },
    { range: '5 - 10 Jt', KK: demographics.income_5m_to_10m || 0 },
    { range: '> 10 Jt', KK: demographics.income_above_10m || 0 },
  ];

  const educationData = [
    { name: 'SD', value: demographics.edu_sd || 0 },
    { name: 'SMP', value: demographics.edu_smp || 0 },
    { name: 'SMA', value: demographics.edu_sma || 0 },
    { name: 'PT', value: demographics.edu_pt || 0 },
    { name: 'Tdk Sekolah', value: demographics.edu_tidak_sekolah || 0 },
  ];

  const professionData = [
    { name: 'PNS', jumlah: demographics.prof_pns || 0 },
    { name: 'Swasta', jumlah: demographics.prof_swasta || 0 },
    { name: 'Wira', jumlah: demographics.prof_wiraswasta || 0 },
    { name: 'Nelayan', jumlah: demographics.prof_nelayan || 0 },
    { name: 'Lainnya', jumlah: demographics.prof_lainnya || 0 },
  ];

  const activeKk = kkList.find(kk => kk.id === selectedKkId);

  // Filtered members list based on showInactive status
  const displayedMembers = activeKk?.members.filter(m => {
    if (showInactive) return true; // Show all
    return !m.status || m.status === 'Aktif'; // Show only active
  }) || [];

  return (
    <div className="space-y-6">
      
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => { setActiveSubTab('database'); setSelectedKkId(null); }}
          className={`px-6 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
            activeSubTab === 'database'
              ? 'border-[#1E4D6B] text-[#1E4D6B]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Database Kartu Keluarga (KK)
        </button>
        <button
          onClick={() => setActiveSubTab('visualisasi')}
          className={`px-6 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
            activeSubTab === 'visualisasi'
              ? 'border-[#1E4D6B] text-[#1E4D6B]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Visualisasi & Ringkasan Grafik
        </button>
      </div>

      {activeSubTab === 'database' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: KK LIST or MEMBER DETAIL */}
          <div className="lg:col-span-8 space-y-6">
            {!selectedKkId ? (
              <div className="premium-card p-6 sm:p-8 space-y-6">
                {/* Header with Search */}
                <div className="border-b border-slate-100 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Daftar KK Terdaftar</h3>
                    <p className="text-xs text-slate-500 font-semibold mt-1">Pilih KK untuk melihat detail & menambah anggota keluarga.</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text"
                      placeholder="Cari No. KK / Kepala..."
                      value={searchKk}
                      onChange={(e) => setSearchKk(e.target.value)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-400"
                    />
                    <span className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-full shrink-0">
                      {filteredKkList.length} KK
                    </span>
                  </div>
                </div>

                {filteredKkList.length === 0 ? (
                  <div className="text-center py-12 text-xs font-semibold text-slate-400">
                    Belum ada Kartu Keluarga terdaftar atau hasil pencarian kosong.
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="divide-y divide-slate-100">
                      {filteredKkList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((kk) => {
                        const activeWargaCount = kk.members.filter(m => !m.status || m.status === 'Aktif').length;
                        return (
                          <div 
                            key={kk.id} 
                            onClick={() => setSelectedKkId(kk.id)}
                            className="py-4 flex items-center justify-between hover:bg-slate-50/50 px-4 rounded-xl transition-all cursor-pointer group"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 rounded-xl bg-[#1E4D6B]/5 flex items-center justify-center text-[#1E4D6B] group-hover:scale-105 transition-transform">
                                <Users className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-sm font-black text-slate-900">KK: {kk.no_kk}</h4>
                                <p className="text-xs text-slate-500 font-bold">Kepala: {kk.kepala_keluarga}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-[10px] font-black text-[#5F8D4E] bg-[#85A389]/10 border border-[#85A389]/25 px-2.5 py-0.5 rounded-full" title="Anggota Keluarga Aktif">
                                {activeWargaCount} Jiwa
                              </span>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleEditKkClick(kk); }}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteKk(kk.id); }}
                                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-55 transition-colors"
                                title="Hapus"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination Controls */}
                    {Math.ceil(kkList.length / itemsPerPage) > 1 && (
                      <div className="flex items-center justify-center space-x-1.5 pt-4">
                        <button
                          onClick={(e) => { e.stopPropagation(); setCurrentPage(prev => Math.max(prev - 1, 1)); }}
                          disabled={currentPage === 1}
                          className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-600 font-extrabold text-xs transition-all active:scale-95 disabled:active:scale-100 flex items-center justify-center min-w-[32px] h-8"
                          aria-label="Previous page"
                        >
                          &larr;
                        </button>
                        {Array.from({ length: Math.ceil(kkList.length / itemsPerPage) }, (_, i) => i + 1).map((p) => (
                          <button
                            key={p}
                            onClick={(e) => { e.stopPropagation(); setCurrentPage(p); }}
                            className={`w-8 h-8 rounded-lg text-xs font-black transition-all active:scale-95 border ${
                              currentPage === p
                                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                        <button
                          onClick={(e) => { e.stopPropagation(); setCurrentPage(prev => Math.min(prev + 1, Math.ceil(kkList.length / itemsPerPage))); }}
                          disabled={currentPage === Math.ceil(kkList.length / itemsPerPage)}
                          className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-600 font-extrabold text-xs transition-all active:scale-95 disabled:active:scale-100 flex items-center justify-center min-w-[32px] h-8"
                          aria-label="Next page"
                        >
                          &rarr;
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              // MEMBER DETAIL VIEW
              <div className="premium-card p-6 sm:p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => { setSelectedKkId(null); setShowAddMember(false); setEditingMemberId(null); }}
                    className="flex items-center space-x-1.5 text-slate-500 hover:text-slate-900 transition-colors text-xs font-black"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Daftar KK</span>
                  </button>

                  <label className="flex items-center space-x-2 text-xs font-black text-slate-700 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={showInactive}
                      onChange={(e) => setShowInactive(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-[#1E4D6B] border-slate-350 focus:ring-[#1E4D6B]"
                    />
                    <span>Tampilkan Riwayat Warga Keluar/Meninggal</span>
                  </label>
                </div>

                <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">KK: {activeKk?.no_kk}</h3>
                    <p className="text-xs text-slate-500 font-bold">Kepala Keluarga: <span className="text-slate-800">{activeKk?.kepala_keluarga}</span></p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                      Pendapatan: {activeKk?.income === 'under_2m' ? '< 2 Juta' : activeKk?.income === '2m_5m' ? '2 - 5 Juta' : activeKk?.income === '5m_10m' ? '5 - 10 Jt' : '> 10 Juta'}
                    </span>
                    <button
                      onClick={() => {
                        setShowAddMember(!showAddMember);
                        setEditingMemberId(null);
                        setMemberName('');
                        setMemberNik('');
                        setMemberBirthDate('');
                        setMemberStatus('Aktif');
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-white font-extrabold text-xs shadow transition-all flex items-center space-x-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{showAddMember ? 'Batal' : 'Tambah Anggota'}</span>
                    </button>
                  </div>
                </div>

                {/* Inline Member Form */}
                {showAddMember && (
                  <form onSubmit={handleAddOrEditMember} className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-4 text-xs font-bold text-slate-700">
                    <h4 className="text-sm font-black text-slate-900">{editingMemberId ? 'Edit Anggota Keluarga' : 'Tambah Anggota Keluarga Baru'}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-505 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                        <input
                          type="text"
                          value={memberName}
                          onChange={(e) => setMemberName(e.target.value)}
                          placeholder="Contoh: Dessy Adelia"
                          className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200 text-sm font-black text-slate-800 focus:outline-none focus:border-[#85A389]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-slate-505 uppercase tracking-wider mb-1.5">NIK (KTP)</label>
                        <input
                          type="text"
                          value={memberNik}
                          onChange={(e) => setMemberNik(e.target.value)}
                          placeholder="NIK 16 Digit"
                          className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200 text-sm font-black text-slate-800 focus:outline-none focus:border-[#85A389]"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-slate-505 uppercase tracking-wider mb-1.5">Jenis Kelamin</label>
                        <select
                          value={memberGender}
                          onChange={(e) => setMemberGender(e.target.value as any)}
                          className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200 text-sm font-black text-slate-850"
                        >
                          <option value="Laki-laki">Laki-laki</option>
                          <option value="Perempuan">Perempuan</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-505 uppercase tracking-wider mb-1.5">Tanggal Lahir</label>
                        <input
                          type="date"
                          value={memberBirthDate}
                          onChange={(e) => setMemberBirthDate(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200 text-sm font-black text-slate-850"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-slate-505 uppercase tracking-wider mb-1.5">Pendidikan Terakhir</label>
                        <select
                          value={memberEducation}
                          onChange={(e) => setMemberEducation(e.target.value as any)}
                          className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200 text-sm font-black text-slate-850"
                        >
                          <option value="SD">SD/Sederajat</option>
                          <option value="SMP">SMP/Sederajat</option>
                          <option value="SMA">SMA/Sederajat</option>
                          <option value="Sarjana/Diploma">Diploma/Sarjana</option>
                          <option value="Tidak Sekolah">Belum/Tidak Sekolah</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-slate-505 uppercase tracking-wider mb-1.5">Tanggal Pendaftaran/Masuk RT</label>
                        <input
                          type="date"
                          value={memberRegDate}
                          onChange={(e) => setMemberRegDate(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200 text-sm font-black text-slate-850"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-505 uppercase tracking-wider mb-1.5">Status Kependudukan</label>
                        <select
                          value={memberStatus}
                          onChange={(e) => setMemberStatus(e.target.value as any)}
                          className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200 text-sm font-black text-slate-850"
                        >
                          <option value="Aktif">Aktif (Tinggal di RT)</option>
                          <option value="Keluar">Mutasi Keluar (Pindah)</option>
                          <option value="Meninggal">Meninggal Dunia</option>
                        </select>
                      </div>
                      <div className="flex flex-col justify-center pt-2">
                        <label className="flex items-center space-x-2 text-sm font-black text-slate-800 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={memberIsUmkm}
                            onChange={(e) => setMemberIsUmkm(e.target.checked)}
                            className="w-4 h-4 rounded text-[#1E4D6B] border-slate-300 focus:ring-[#1E4D6B]"
                          />
                          <span>Memiliki Usaha / UMKM Aktif</span>
                        </label>
                      </div>
                    </div>

                    {memberIsUmkm && (
                      <div className="animate-fade-in">
                        <label className="block text-slate-505 uppercase tracking-wider mb-1.5">Nama / Bidang Usaha UMKM</label>
                        <input
                          type="text"
                          value={memberUmkmName}
                          onChange={(e) => setMemberUmkmName(e.target.value)}
                          placeholder="Contoh: Warung Sembako Berkah, Bengkel Motor"
                          className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200 text-sm font-black text-slate-800 focus:outline-none focus:border-[#85A389]"
                          required
                        />
                      </div>
                    )}

                    {/* Exit details for moved or deceased citizens */}
                    {memberStatus !== 'Aktif' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-rose-50 border border-rose-200 animate-fade-in">
                        <div>
                          <label className="block text-rose-800 uppercase tracking-wider mb-1.5">Tanggal Mutasi Keluar / Meninggal</label>
                          <input
                            type="date"
                            value={memberExitDate}
                            onChange={(e) => setMemberExitDate(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-rose-200 text-sm font-black text-slate-850"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-rose-800 uppercase tracking-wider mb-1.5">Alasan / Keterangan Keluar</label>
                          <select
                            value={memberExitReason}
                            onChange={(e) => setMemberExitReason(e.target.value as any)}
                            className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-rose-200 text-sm font-black text-slate-850"
                          >
                            <option value="Pindah">Pindah Domisili/Rumah</option>
                            <option value="Meninggal">Meninggal Dunia</option>
                            <option value="Lainnya">Alasan Lainnya</option>
                          </select>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-end gap-4 pt-2">
                      <div className="flex-1">
                        <label className="block text-slate-505 uppercase tracking-wider mb-1.5">Pekerjaan</label>
                        <select
                          value={memberJob}
                          onChange={(e) => setMemberJob(e.target.value as any)}
                          className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200 text-sm font-black text-slate-850"
                        >
                          <option value="PNS">PNS / TNI / Polri</option>
                          <option value="Swasta">Karyawan Swasta</option>
                          <option value="Wiraswasta">Wiraswasta / UMKM</option>
                          <option value="Nelayan">Nelayan / Sektor Maritim</option>
                          <option value="Lainnya">Lainnya / Belum Bekerja</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-white font-extrabold text-xs shadow-sm transition-all disabled:opacity-60"
                      >
                        {loading ? 'Menyimpan...' : (editingMemberId ? 'Simpan Perubahan' : 'Simpan Anggota')}
                      </button>
                    </div>
                  </form>
                )}

                {/* Member List Table */}
                {displayedMembers.length === 0 ? (
                  <div className="text-center py-12 text-xs font-semibold text-slate-400">
                    Tidak ada anggota keluarga yang sesuai dengan filter.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-bold text-slate-700">
                      <thead>
                        <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider">
                          <th className="pb-3">Nama</th>
                          <th className="pb-3">NIK</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">L/P</th>
                          <th className="pb-3">Usia</th>
                          <th className="pb-3">Pendidikan</th>
                          <th className="pb-3">Pekerjaan</th>
                          <th className="pb-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {displayedMembers.map((m) => {
                          const birthYear = m.birthDate ? new Date(m.birthDate).getFullYear() : 0;
                          const currentYear = new Date().getFullYear();
                          const age = birthYear ? currentYear - birthYear : '-';
                          return (
                            <tr key={m.id} className={`hover:bg-slate-50/50 ${m.status && m.status !== 'Aktif' ? 'opacity-60 bg-rose-50/30' : ''}`}>
                              <td className="py-3.5 pr-2 font-black text-slate-900">
                                <div>{m.name}</div>
                                {m.isUmkm && (!m.status || m.status === 'Aktif') && (
                                  <div className="inline-block mt-1 text-[9px] font-black uppercase tracking-wider text-[#5F8D4E] bg-[#85A389]/10 border border-[#85A389]/20 px-2 py-0.5 rounded">
                                    UMKM: {m.umkmName || 'Aktif'}
                                  </div>
                                )}
                              </td>
                              <td className="py-3.5 pr-2 font-mono">{m.nik}</td>
                              <td className="py-3.5 pr-2">
                                {!m.status || m.status === 'Aktif' ? (
                                  <span className="text-[9px] font-black text-[#5F8D4E] bg-[#85A389]/10 border border-[#85A389]/20 px-2 py-0.5 rounded-full">Aktif</span>
                                ) : m.status === 'Keluar' ? (
                                  <span className="text-[9px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full" title={`Mutasi Pindah: ${m.exitDate}`}>Pindah</span>
                                ) : (
                                  <span className="text-[9px] font-black text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full" title={`Meninggal: ${m.exitDate}`}>Wafat</span>
                                )}
                              </td>
                              <td className="py-3.5 pr-2">{m.gender === 'Laki-laki' ? 'L' : 'P'}</td>
                              <td className="py-3.5 pr-2">
                                <div>{age} thn</div>
                                <div className="text-[10px] text-slate-400 font-semibold">{m.registrationDate ? `Masuk: ${m.registrationDate}` : ''}</div>
                              </td>
                              <td className="py-3.5 pr-2">{m.education === 'Sarjana/Diploma' ? 'S1/Dip' : m.education}</td>
                              <td className="py-3.5 pr-2">{m.job}</td>
                              <td className="py-3.5 text-right space-x-1.5">
                                <button
                                  onClick={() => handleEditMemberClick(m)}
                                  className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteMember(m.id)}
                                  className="p-1 rounded text-rose-500 hover:text-rose-600 hover:bg-rose-55 transition-colors"
                                  title="Hapus Permanen"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: ADD/EDIT KK FORM */}
          <div className="lg:col-span-4">
            <form onSubmit={handleAddOrEditKk} className="premium-card p-6 sm:p-8 space-y-6 text-xs font-bold text-slate-700">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900">
                  {editingKkId ? 'Ubah Kartu Keluarga' : 'Tambah Kartu Keluarga (KK)'}
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  Masukkan No. KK dan nama Kepala Keluarga untuk mendaftarkan KK baru.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-505 uppercase tracking-wider mb-1.5">Nomor Kartu Keluarga (KK)</label>
                  <input
                    type="text"
                    value={newNoKk}
                    onChange={(e) => setNewNoKk(e.target.value.replace(/\D/g, ''))}
                    placeholder="16 Digit No. KK"
                    maxLength={16}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-black text-slate-800 focus:outline-none focus:border-[#85A389]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-505 uppercase tracking-wider mb-1.5">Nama Kepala Keluarga</label>
                  <input
                    type="text"
                    value={newKepala}
                    onChange={(e) => setNewKepala(e.target.value)}
                    placeholder="Nama Lengkap Kepala Keluarga"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-black text-slate-800 focus:outline-none focus:border-[#85A389]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-505 uppercase tracking-wider mb-1.5">Estimasi Pendapatan Keluarga</label>
                  <select
                    value={newIncome}
                    onChange={(e) => setNewIncome(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-black text-slate-850"
                  >
                    <option value="under_2m">&lt; Rp 2 Juta (Sederhana)</option>
                    <option value="2m_5m">Rp 2 - 5 Juta (Menengah)</option>
                    <option value="5m_10m">Rp 5 - 10 Juta (Mapan)</option>
                    <option value="above_10m">&gt; Rp 10 Juta (Sejahtera)</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                {editingKkId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingKkId(null);
                      setNewNoKk('');
                      setNewKepala('');
                      setNewIncome('under_2m');
                    }}
                    className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all font-extrabold text-xs"
                  >
                    Batal
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-2 w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-white transition-all font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Menyimpan...' : (editingKkId ? 'Simpan Perubahan' : 'Tambah KK')}</span>
                </button>
              </div>
            </form>
          </div>
          
        </div>
      ) : (
        // VISUALISASI & LIVE PREVIEW GRAPHICS
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start animate-fade-in">
          
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-[#85A389]/10 border border-[#85A389]/25 p-4.5 rounded-2xl flex items-start space-x-3 text-slate-700 text-xs font-semibold leading-relaxed">
              <AlertCircle className="w-5 h-5 text-[#5F8D4E] shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-[#5F8D4E] block mb-0.5">Mode Kalkulasi Otomatis Aktif</span>
                Seluruh data demografi warga dan grafik di bawah ini dihitung dan diperbarui secara otomatis dari basis data KK (Tab Database) yang dikelola oleh sekretaris RT.
              </div>
            </div>

            {/* Read-Only Summary of Demographics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-4.5 text-center shadow-sm">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Total KK</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{demographics.total_kk}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4.5 text-center shadow-sm">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Total Jiwa Aktif</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{demographics.total_warga}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4.5 text-center shadow-sm">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Laki-laki</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{demographics.total_pria}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4.5 text-center shadow-sm">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Perempuan</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{demographics.total_wanita}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-4.5 text-center shadow-sm">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Balita (&lt;5 thn)</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{demographics.total_balita}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4.5 text-center shadow-sm">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Lansia (&gt;60 thn)</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{demographics.total_lansia}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4.5 text-center shadow-sm">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Usia Kerja</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{demographics.total_usia_produktif}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4.5 text-center shadow-sm">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Total UMKM</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{demographics.total_umkm}</p>
              </div>
            </div>

            {/* Monthly new citizens trend / exit citizens trend dual-line chart */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md">
              <div className="border-b border-slate-100 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-slate-700" />
                    <span>Tren Pertumbuhan & Mutasi Penduduk RT</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Statistik pendaftaran warga masuk (mutasi masuk) dan warga keluar/meninggal per bulan</p>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Tahun:</span>
                  <select
                    value={selectedTrendYear}
                    onChange={(e) => setSelectedTrendYear(Number(e.target.value))}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-black text-slate-800 focus:outline-none focus:border-[#85A389]"
                  >
                    {getAvailableTrendYears().map(yr => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1E4D6B" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#1E4D6B" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="colorKeluar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }} />
                    <YAxis tick={{ fill: '#475569', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '16px', color: '#334155' }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 800 }} />
                    <Area name="Warga Masuk (Jiwa)" type="monotone" dataKey="masuk" stroke="#1E4D6B" strokeWidth={3} fillOpacity={1} fill="url(#colorMasuk)" />
                    <Area name="Warga Keluar / Wafat (Jiwa)" type="monotone" dataKey="keluar" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorKeluar)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right column with preview charts */}
          <div className="space-y-6">
            {/* GENDER DOUGHNUT */}
            <div className="premium-card p-6 flex flex-col items-center">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 pb-3 border-b border-slate-100 w-full text-center">
                Proporsi Gender Penduduk
              </h4>
              <div className="w-full h-48 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex space-x-6 text-[10px] font-black uppercase text-slate-600 mt-2">
                <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-[#1E4D6B] mr-1.5" />Pria: {demographics.total_pria}</span>
                <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-[#85A389] mr-1.5" />Wanita: {demographics.total_wanita}</span>
              </div>
            </div>

            {/* INCOME ESTIMATES */}
            <div className="premium-card p-6">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 pb-3 border-b border-slate-100 text-center mb-4">
                Estimasi Pendapatan (KK)
              </h4>
              <div className="w-full h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incomeData}>
                    <XAxis dataKey="range" tick={{ fontSize: 9, fontWeight: 700 }} />
                    <YAxis tick={{ fontSize: 9 }} />
                    <Tooltip />
                    <Bar dataKey="KK" fill="#1E4D6B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* EDUCATION */}
            <div className="premium-card p-6">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 pb-3 border-b border-slate-100 text-center mb-4">
                Rasio Jenjang Pendidikan
              </h4>
              <div className="w-full h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={educationData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={55} fill="#85A389" label={{ fontSize: 8, fontWeight: 700 }}>
                      {educationData.map((entry, idx) => (
                        <Cell key={idx} fill={idx % 2 === 0 ? '#1E4D6B' : '#85A389'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
        </div>
      )}
      
    </div>
  );
};
