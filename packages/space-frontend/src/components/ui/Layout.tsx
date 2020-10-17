import { motion } from 'framer-motion';
import * as React from 'react';
import { IconType } from 'react-icons';
import { AiOutlineUser } from 'react-icons/ai';
import { media } from 'typestyle';
import { useClickOutside, useStylesheet } from '../../hooks';
import { elevation, units } from '../../style';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const classNames = useStylesheet({
    container: {
      background: 'grey',
      width: '100vw',
      height: '100vh',
      position: 'relative',
    },
  });

  return <div className={classNames.container}>{children}</div>;
}

interface LayoutHeaderProps {
  children: React.ReactNode;
}

export function LayoutHeader({ children }: LayoutHeaderProps) {
  const classNames = useStylesheet({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 10,
      ...elevation(),
    },
    box: {
      position: 'relative',
      background: 'ghostwhite',
      width: '100vw',
      height: units(3),
      minWidth: 325,
      maxWidth: '70vw',
      ...media(
        { maxWidth: 425 },
        {
          minWidth: '100vw',
          overflow: 'hidden',
        },
      ),
    },
    items: {
      display: 'grid',
      alignItems: 'center',
      gridAutoColumns: `min-content`,
      gridGap: units(1),
      gridTemplateRows: units(3),
      gridAutoFlow: 'column',
      whiteSpace: 'nowrap',
      wordBreak: 'keep-all',
      overflowX: 'auto',
    },
    corner: {
      position: 'absolute',
      top: 0,
      right: 0,
      background: 'ghostwhite',
      width: 100,
      height: '100%',
      transformOrigin: 'bottom left',
      transform: 'translateX(100%) rotate(-45deg)',
      zIndex: -1,
    },
  });

  return (
    <motion.div
      transition={{ bounce: 0 }}
      initial={{ transform: 'translateY(-100%)' }}
      animate={{ transform: 'translateY(0%)' }}
      exit={{ transform: 'translateY(-100%)' }}
      className={classNames.container}
    >
      <div className={classNames.box}>
        <div className={classNames.items}>{children}</div>
        <div className={classNames.corner} />
      </div>
    </motion.div>
  );
}

interface LayoutContentProps {
  children: React.ReactNode;
}

export function LayoutContent({ children }: LayoutContentProps) {
  const classNames = useStylesheet({
    container: {
      display: 'grid',
      alignItems: 'center',
      justifyItems: 'center',
      width: '100%',
      height: '100%',
    },
  });
  return (
    <motion.div className={classNames.container}>
      <div>{children}</div>
    </motion.div>
  );
}

interface LayoutAsideProps {
  children: React.ReactNode;
}

export function LayoutAside({ children }: LayoutAsideProps) {
  const classNames = useStylesheet({
    container: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      background: 'ghostwhite',
      width: '100vw',
      maxWidth: units(32),
      height: units(38),
      maxHeight: `calc(100vh - ${units(3)})`,
      zIndex: 100,
      overflow: 'auto',
      ...elevation(),
    },
  });

  return <motion.div className={classNames.container}>{children}</motion.div>;
}

interface LayoutAvatarProps {
  icon?: IconType;
  name?: React.ReactNode;
  children: React.ReactNode;
}

export function LayoutAvatar({ icon, name, children }: LayoutAvatarProps) {
  const classNames = useStylesheet({
    container: {
      position: 'absolute',
      top: units(0.5),
      right: units(0.5),
      background: 'ghostwhite',
      borderRadius: units(2),
      zIndex: 1000,
      display: 'grid',
      gridTemplateColumns: 'auto',
      gridTemplateRows: units(4),
      gridAutoRows: 'auto',
      gridAutoFlow: 'row',
      alignItems: 'center',
      overflow: 'hidden',
      ...elevation(),
      ...media(
        { maxWidth: 425 },
        {
          top: units(3.5),
        },
      ),
    },
    header: {
      display: 'grid',
      gridTemplateColumns: name ? `${units(4)} auto` : units(4),
      alignItems: 'center',
    },
    icon: {
      fontSize: units(3),
      justifySelf: 'center',
    },
    name: {
      paddingRight: units(1),
    },
    option: {
      $nest: {
        '&:last-child': {
          paddingBottom: units(1),
        },
      },
    },
  });

  const [isOpen, setOpen] = React.useState(false);

  const itemVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0, transition: { duration: 0 } },
  };

  const Icon = icon ?? AiOutlineUser;

  const ref = useClickOutside<HTMLDivElement>(() => {
    setOpen(false);
  });

  return (
    <motion.div
      ref={ref}
      className={classNames.container}
      initial={{
        scale: 0,
        width: units(4),
        height: units(4),
      }}
      animate={isOpen ? 'open' : 'closed'}
      exit={{
        scale: 0,
        width: units(4),
        height: units(4),
        opacity: 0,
      }}
      variants={{
        open: {
          scale: 1,
          width: 'auto',
          height: 'auto',
          transition: {
            staggerChildren: 0.1,
          },
        },
        closed: {
          scale: 1,
          width: units(4),
          height: units(4),
        },
      }}
    >
      <div className={classNames.header} onClick={() => setOpen((o) => !o)}>
        <Icon className={classNames.icon} />
        {name && (
          <motion.div
            className={classNames.name}
            variants={{ open: { opacity: 1 }, closed: { opacity: 0 } }}
          >
            {name}
          </motion.div>
        )}
      </div>
      {React.Children.map(
        children,
        (child) =>
          child && (
            <motion.div
              variants={itemVariants}
              className={classNames.option}
              onClick={() => setOpen(false)}
            >
              {child}
            </motion.div>
          ),
      )}
    </motion.div>
  );
}

Layout.Header = LayoutHeader;
Layout.Content = LayoutContent;
Layout.Aside = LayoutAside;
Layout.Avatar = LayoutAvatar;
