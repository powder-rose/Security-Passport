import './LegalPage.css';
import './components/LegalHeader/LegalHeader.css';
import './components/LegalContent/LegalContent.css';
import './components/LegalFooter/LegalFooter.css';
import './LegalPageResponsive.css';

import LegalSeo from './components/LegalSeo/LegalSeo';

import LegalHeader from './components/LegalHeader/LegalHeader';

import LegalContent from './components/LegalContent/LegalContent';

import LegalFooter from './components/LegalFooter/LegalFooter';

export default function LegalPage({ document }) {
  return (
    <>
      <LegalSeo document={document} />

      <div className="legal-page">
        <LegalHeader />

        <LegalContent document={document} />

        <LegalFooter />
      </div>
    </>
  );
}
