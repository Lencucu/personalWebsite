import Image from 'next/image';
import styles from './module_gallery.css';

export default function GalleryPage() {
  return (
    <div>
      <div className={styles.galleryContainer}>
        <div className={styles.gallery}>
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Image
              key={i}
              src={`/images/gallery/${i}.png`}
              alt={`img${i}`}
              width={600}
              height={400}
              className={styles.img}
            />
          ))}
        </div>
      </div>
      <div className={styles.scrollHint}>PC端请用 Shift + 鼠标滚轮 来浏览图片</div>
    </div>
  );
}
