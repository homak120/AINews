import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

interface VideoPlayerProps {
  youtubeId: string;
  sourceUrl: string;
  title: string;
}

export function VideoPlayer({ youtubeId, sourceUrl, title }: VideoPlayerProps) {
  return (
    <div className="rounded-xl overflow-hidden mb-6">
      <LiteYouTubeEmbed id={youtubeId} title={title} />
      <p className="mt-2 text-center">
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          Watch on YouTube →
        </a>
      </p>
    </div>
  );
}
