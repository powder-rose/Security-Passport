import {
  createPortal,
} from 'react-dom';


export default function MobileMenuPortal({
  active,
  children,
}) {
  if (
    !active ||
    typeof document ===
      'undefined'
  ) {
    return children;
  }

  return createPortal(
    children,
    document.body,
  );
}
