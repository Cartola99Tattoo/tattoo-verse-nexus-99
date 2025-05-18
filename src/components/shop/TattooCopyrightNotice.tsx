
import React from "react";

interface TattooCopyrightNoticeProps {
  artistName: string;
}

const TattooCopyrightNotice: React.FC<TattooCopyrightNoticeProps> = ({ artistName }) => {
  return (
    <div className="mt-4 text-sm italic text-gray-500 p-3 border-l-2 border-gray-200">
      Tatuagens são procedimentos artísticos e personalizados para que cada traço da sua tattoo 
      seja único e exclusivo. Ao reservar essa arte você estará garantindo uma obra de arte feita 
      especialmente para você. Todos os direitos autorais precisam ser preservados e essa arte só 
      poderá ser tatuada e reproduzida por {artistName}.
    </div>
  );
};

export default TattooCopyrightNotice;
