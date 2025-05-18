
import React from "react";
import { Info } from "lucide-react";

interface TattooCopyrightNoticeProps {
  artistName?: string;
}

const TattooCopyrightNotice: React.FC<TattooCopyrightNoticeProps> = ({ 
  artistName = "o artista" 
}) => {
  return (
    <div className="mt-3 pt-2 border-t border-dashed border-gray-200">
      <div className="flex text-xs text-gray-500 items-start">
        <Info className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
        <p>
          Ao realizar o pagamento, você reconhece que o design da tatuagem é propriedade 
          intelectual de {artistName} e não pode ser reproduzido sem autorização. 
          O valor mostrado é uma estimativa inicial e o orçamento final poderá 
          variar após análise detalhada pelo artista.
        </p>
      </div>
    </div>
  );
};

export default TattooCopyrightNotice;
