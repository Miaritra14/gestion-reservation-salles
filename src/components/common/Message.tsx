
interface MessageProps {
  texte: string;
  type?: "success" | "error" | "info";
}

function Message({ texte, type = "info" }: MessageProps) {
  // Ne rien afficher si le message est vide
  if (!texte) {
    return null;
  }

  const couleurs = {
    success: "border-green-300 bg-green-100 text-green-800",
    error: "border-red-300 bg-red-100 text-red-800",
    info: "border-blue-300 bg-blue-100 text-blue-800",
  };

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`mb-4 rounded-lg border p-3 ${couleurs[type]}`}
    >
      {texte}
    </div>
  );
}

export default Message;
