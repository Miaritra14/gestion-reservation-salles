
import type { Salle, Reservation } from "../../types";
import ReservationCard from "./ReservationCard";

interface ReservationListProps {
  reservations: Reservation[];
  salles: Salle[];
}

function ReservationList({
  reservations,
  salles,
}: ReservationListProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center justify-between gap-2 border-b border-gray-200 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-800">
            Mes réservations
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Consultez les détails et le statut de vos demandes.
          </p>
        </div>

        <span className="shrink-0 rounded-md bg-[#E8F0EE] px-2.5 py-1 text-xs font-medium text-[#527D75]">
          {reservations.length}
        </span>
      </div>

      {reservations.length === 0 ? (
        <p className="p-5 text-center text-sm text-gray-500">
          Vous n'avez pas encore de réservation.
        </p>
      ) : (
        <div className="space-y-3 p-3">
          {reservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              salles={salles}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ReservationList;
