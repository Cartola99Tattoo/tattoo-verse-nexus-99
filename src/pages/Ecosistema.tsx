
import React from "react";
import { EcosistemaAuthProvider } from "@/contexts/EcosistemaAuthContext";
import EcosistemaHero from "@/components/ecosistema/EcosistemaHero";
import ClientBenefits from "@/components/ecosistema/ClientBenefits";
import ArtistBenefits from "@/components/ecosistema/ArtistBenefits";

const Ecosistema = () => {
  return (
    <EcosistemaAuthProvider>
      <div className="min-h-screen">
        <EcosistemaHero />
        <ClientBenefits />
        <ArtistBenefits />
      </div>
    </EcosistemaAuthProvider>
  );
};

export default Ecosistema;
