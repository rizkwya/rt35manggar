import React, { useState, useEffect } from 'react';
import { UserRole, RTSettings, NavigationItem, RTPengurus } from '../../types/database';
import { HeaderBanner } from '../../components/landing/HeaderBanner';
import { ProfileSection } from '../../components/landing/ProfileSection';
import { DemographicsSection } from '../../components/landing/DemographicsSection';
import { OrganogramSection } from '../../components/landing/OrganogramSection';
import { LatestActivitiesSection } from '../../components/landing/LatestActivitiesSection';
import { DeveloperCreditsSection } from '../../components/landing/DeveloperCreditsSection';
import { ContactLocationSection } from '../../components/landing/ContactLocationSection';
import { SupabaseService, supabase } from '../../lib/supabase';

interface LandingPageProps {
  currentRole: UserRole;
  navigateTo: (path: string) => void;
  settings?: RTSettings;
  navItems: NavigationItem[];
  pengurusList: RTPengurus[];
  onSettingsUpdate?: (settings: RTSettings) => void;
  defaultFormTab?: 'aspirasi' | 'wajib_lapor';
  onClearDefaultFormTab?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  currentRole,
  navigateTo,
  settings,
  navItems: initialNavItems,
  pengurusList,
  onSettingsUpdate,
  defaultFormTab,
  onClearDefaultFormTab
}) => {
  const [navItems, setNavItems] = useState<NavigationItem[]>(initialNavItems || []);

  useEffect(() => {
    const loadLiveNav = async () => {
      try {
        const liveItems = await SupabaseService.fetchNavItems();
        if (liveItems && liveItems.length > 0) {
          setNavItems(liveItems);
        }
      } catch (err) {
        console.warn('Failed to fetch live navigation items:', err);
      }
    };
    loadLiveNav();

    const channel = supabase
      .channel('realtime-navigation-public')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rt_navigation_items' },
        async () => {
          const updatedItems = await SupabaseService.fetchNavItems();
          if (updatedItems) {
            setNavItems(updatedItems);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialNavItems]);
  return (
    <>
      {/* 1. HERO BANNER PORTAL RT 35 */}
      <HeaderBanner
        currentRole={currentRole}
        onOpenAuth={() => navigateTo('/login')}
        onOpenDashboard={() => navigateTo('/admin/dashboard')}
        onOpenPresensi={() => navigateTo('/presensi')}
        settings={settings}
      />

      {/* 2. PROFIL RT (VISI, MISI, SEJARAH, BATAS WILAYAH) */}
      <ProfileSection settings={settings} />

      {/* 3. STATISTIK DEMOGRAFI & WARGA */}
      <DemographicsSection settings={settings} />

      {/* 4. ORGANOGRAM & PENGURUS RT 35 */}
      <OrganogramSection pengurusList={pengurusList} />

      {/* 6. DOKUMENTASI KEGIATAN TERBARU */}
      <LatestActivitiesSection navigateTo={navigateTo} navItems={navItems} />

      {/* TENTANG PENGEMBANG KKN UNIVERSITAS MULIA */}
      <DeveloperCreditsSection navigateTo={navigateTo} />

      {/* 7. POSKO, LOKASI & CONTACT ASPIRASI WARGA */}
      <ContactLocationSection 
        settings={settings} 
        onSettingsUpdate={onSettingsUpdate} 
        defaultFormTab={defaultFormTab}
        onClearDefaultFormTab={onClearDefaultFormTab}
      />
    </>
  );
};
