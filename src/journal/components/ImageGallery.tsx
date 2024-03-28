import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Note } from '../types';

function srcset(image: string, size: number, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

type ImageGalleryProps = {
  note: Note;
}

export const ImageGallery = ({ note }:ImageGalleryProps) => {

  const itemData = () => {
    return note.imageUrls.map(imageUrl => (
      {
        img: imageUrl,
        title: imageUrl.split('/')[8],
        rows: 2,
        cols: 2,
      }
    ))
  }

  return (
    <ImageList
      sx={{ width: '100%', height: 450 }}
      variant="quilted"
      cols={4}
      rowHeight={121}
    >
      {itemData().map((item) => (
        <ImageListItem key={item.img} cols={item.cols || 1} rows={item.rows || 1}>
          <img
            {...srcset(item.img, 121, item.rows, item.cols)}
            alt={item.title}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
