import React from 'react';

const Link = ({ children, href, ...rest }: { children: React.ReactNode, href: string }) => {
  return <a href={href} {...rest}>{children}</a>;
};

export default Link;