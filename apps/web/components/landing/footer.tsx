"use client";

export function Footer() {
  return (
    <footer className="bg-[#060f1d] py-12 border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-xl font-bold text-gold tracking-wider">
              AQUANTICA
            </h3>
            <p className="text-xs text-white/40 uppercase tracking-wider mt-1">
              Creamos futuro, construimos sueños
            </p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-6">
            {[
              "Profesionales Especializados",
              "Calidad y Compromiso",
              "Seguridad Garantizada",
            ].map((badge) => (
              <div key={badge} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 border border-gold rotate-45" />
                <span className="text-xs text-white/40 uppercase tracking-wider">
                  {badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Aquantica — Saneamiento Físico Legal y
            Gestión Inmobiliaria · Jr. Lima 354, Edificio Murakami, Piso 7 Of.
            704, Lima, Perú.
          </p>
        </div>
      </div>
    </footer>
  );
}
