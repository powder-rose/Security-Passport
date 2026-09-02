export default function Container({ as: Tag = 'div', className = '', children, ...props }) {
  return <Tag className={`container ${className}`.trim()} {...props}>{children}</Tag>;
}
