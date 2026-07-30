import React from 'react';
import { UserRole, RTSettings } from '../../types/database';
import { HeaderBanner } from '../../components/landing/HeaderBanner';
import { ProfileSection } from '../../components/landing/ProfileSection';
import { DemographicsSection } from '../../components/landing/DemographicsSection';
import { OrganogramSection } from '../../components/landing/OrganogramSection';
import { LatestActivitiesSection } from '../../components/landing/LatestActivitiesSection';
import { ContactLocationSection } from '../../components/landing/ContactLocationSection';

interface LandingPageProps {
  currentRole: UserRole;
  navigateTo: (path: string) => void;
  settings?: RTSettings;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  currentRole,
  navigateTo,
  settings
}) => {
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
      <OrganogramSection />

      {/* 6. DOKUMENTASI KEGIATAN TERBARU */}
      <LatestActivitiesSection navigateTo={navigateTo} />

      {/* 7. POSKO, LOKASI & CONTACT ASPIRASI WARGA */}
      <ContactLocationSection settings={settings} />
    </>
  );
};
