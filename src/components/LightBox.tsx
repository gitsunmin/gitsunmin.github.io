import { useState } from 'react';
import Lightbox, { Slide } from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

type Props = React.PropsWithChildren<{
  slides: Slide[];
  className?: string;
}>;

export const LightBox = ({ slides, className, children }: Props) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <button type="button" onClick={handleOpen} className={className}>
        {children}
      </button>

      <Lightbox open={open} close={handleClose} slides={slides} />
    </>
  );
};
