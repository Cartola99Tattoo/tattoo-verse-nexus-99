
import React from "react";
import { AlertTriangle } from "lucide-react";

interface TattooCopyrightNoticeProps {
  artistName: string;
}

const TattooCopyrightNotice: React.FC<TattooCopyrightNoticeProps> = ({ artistName }) => {
  return (
    <div className="mt-4 text-sm text-gray-600 p-3 border-l-2 border-red-200 bg-red-50 rounded-r-md">
      <div className="flex items-start space-x-2">
        <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-gray-800 text-sm mb-1">Direitos Autorais</h4>
          <p className="italic">
            Tatuagens são procedimentos artísticos e personalizados para que cada traço da sua tattoo 
            seja único e exclusivo. Ao reservar essa arte você estará garantindo uma obra de arte feita 
            especialmente para você. <span className="font-medium">Todos os direitos autorais precisam ser preservados</span> e essa arte só 
            poderá ser tatuada e reproduzida por {artistName}.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TattooCopyrightNotice;
