import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AudiobookState {
  isPlaying: boolean;
  isLoading: boolean;
  currentPageIndex: number;
}

export const useAudiobook = (pages: Array<{ title: string; content: string; chapter?: string }>) => {
  const [state, setState] = useState<AudiobookState>({
    isPlaying: false,
    isLoading: false,
    currentPageIndex: 0,
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCache = useRef<Map<number, string>>(new Map());

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      // Clean up cached audio URLs
      audioCache.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const generateAudio = async (pageIndex: number): Promise<string> => {
    // Check cache first
    if (audioCache.current.has(pageIndex)) {
      return audioCache.current.get(pageIndex)!;
    }

    const page = pages[pageIndex];
    const textToSpeak = `${page.chapter ? page.chapter + '. ' : ''}${page.title}. ${page.content}`;

    const { data, error } = await supabase.functions.invoke('text-to-speech', {
      body: { text: textToSpeak, voice: 'Aria' },
    });

    if (error) throw error;
    if (!data?.audioContent) throw new Error('No audio content received');

    // Convert base64 to blob URL
    const binaryString = atob(data.audioContent);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(blob);

    // Cache the audio URL
    audioCache.current.set(pageIndex, audioUrl);

    return audioUrl;
  };

  const playPage = async (pageIndex: number) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      const audioUrl = await generateAudio(pageIndex);

      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.onended = () => {
          // Auto-play next page
          if (pageIndex < pages.length - 1) {
            playPage(pageIndex + 1);
          } else {
            setState(prev => ({ ...prev, isPlaying: false, currentPageIndex: 0 }));
          }
        };
      }

      audioRef.current.src = audioUrl;
      await audioRef.current.play();

      setState({
        isPlaying: true,
        isLoading: false,
        currentPageIndex: pageIndex,
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      toast.error('Failed to play audio. Please try again.');
      setState(prev => ({ ...prev, isLoading: false, isPlaying: false }));
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setState(prev => ({ ...prev, isPlaying: false }));
  };

  const resume = () => {
    if (audioRef.current && audioRef.current.src) {
      audioRef.current.play();
      setState(prev => ({ ...prev, isPlaying: true }));
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setState({
      isPlaying: false,
      isLoading: false,
      currentPageIndex: 0,
    });
  };

  return {
    ...state,
    playPage,
    pause,
    resume,
    stop,
  };
};
