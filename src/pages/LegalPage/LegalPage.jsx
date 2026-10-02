import './LegalPage.css';

import LegalSeo
from './components/LegalSeo';

import LegalHeader
from './components/LegalHeader';

import LegalContent
from './components/LegalContent';

import LegalFooter
from './components/LegalFooter';


export default function LegalPage({
  document,
}) {
  return (
    <>
      <LegalSeo
        document={document}
      />

      <div className="legal-page">
        <LegalHeader />

        <LegalContent
          document={document}
        />

        <LegalFooter />
      </div>
    </>
  );
}
