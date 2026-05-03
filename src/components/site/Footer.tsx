import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="bg-foreground text-background mt-24">
      <div className="container mx-auto px-4 lg:px-8 py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="bg-background/95 rounded-lg p-3 inline-block mb-4">
            <img src={logo} alt="Well Done Services Company" className="h-12 w-auto" />
          </div>
          <p className="text-sm opacity-75 leading-relaxed">
            Acteur de la transformation digitale au Sénégal et en Afrique. Nous concevons des solutions IT robustes et orientées résultats.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold mb-4 uppercase tracking-wider opacity-90">Navigation</h4>
          <ul className="space-y-2 text-sm opacity-75">
            <li><Link to="/services" className="hover:opacity-100 hover:text-primary-glow">Services</Link></li>
            <li><Link to="/realisations" className="hover:opacity-100 hover:text-primary-glow">Réalisations</Link></li>
            <li><Link to="/blog" className="hover:opacity-100 hover:text-primary-glow">Blog</Link></li>
            <li><Link to="/a-propos" className="hover:opacity-100 hover:text-primary-glow">À propos</Link></li>
            <li><Link to="/contact" className="hover:opacity-100 hover:text-primary-glow">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold mb-4 uppercase tracking-wider opacity-90">Services</h4>
          <ul className="space-y-2 text-sm opacity-75">
            <li>Développement Web</li>
            <li>Solutions logicielles (ERP/CRM)</li>
            <li>Maintenance & Réseaux</li>
            <li>Gestion scolaire</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold mb-4 uppercase tracking-wider opacity-90">Contact</h4>
          <ul className="space-y-3 text-sm opacity-75">
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" /> Dakar, Sénégal</li>
            <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 shrink-0" /> contact@welldonescompany.com</li>
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 shrink-0" /> +221 00 000 00 00</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs opacity-70">
          <p>© {new Date().getFullYear()} Well Done Services Company SARL. Tous droits réservés.</p>
          <p>Conçu pour accélérer la transformation digitale en Afrique.</p>
        </div>
      </div>
    </footer>
  );
}
