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
    console.log('generateAudio called for page:', pageIndex);
    
    // Check cache first
    if (audioCache.current.has(pageIndex)) {
      console.log('Audio found in cache for page:', pageIndex);
      return audioCache.current.get(pageIndex)!;
    }

    const page = pages[pageIndex];
    const textToSpeak = `${page.chapter ? page.chapter + '. ' : ''}${page.title}. ${page.content}`;
    console.log('Text to speak length:', textToSpeak.length, 'characters');
    console.log('Text preview:', textToSpeak.substring(0, 100) + '...');

    console.log('Invoking text-to-speech edge function...');
    const { data, error } = await supabase.functions.invoke('text-to-speech', {
      body: { text: textToSpeak, voice: 'Aria' },
    });

    console.log('Edge function response:', { data, error });

    if (error) {
      console.error('Edge function error:', error);
      throw error;
    }
    if (!data?.audioContent) {
      console.error('No audio content in response:', data);
      throw new Error('No audio content received');
    }

    console.log('Converting base64 to blob...');
    // Convert base64 to blob URL
    const binaryString = atob(data.audioContent);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(blob);
    console.log('Audio blob created, URL:', audioUrl);

    // Cache the audio URL
    audioCache.current.set(pageIndex, audioUrl);

    return audioUrl;
  };

  const playPage = async (pageIndex: number) => {
    try {
      console.log('Starting playPage for index:', pageIndex);
      setState(prev => ({ ...prev, isLoading: true }));

      console.log('Calling generateAudio...');
      const audioUrl = await generateAudio(pageIndex);
      console.log('Audio URL generated:', audioUrl ? 'success' : 'failed');

      if (!audioRef.current) {
        console.log('Creating new Audio element');
        audioRef.current = new Audio();
        audioRef.current.onended = () => {
          console.log('Audio ended for page:', pageIndex);
          // Auto-play next page
          if (pageIndex < pages.length - 1) {
            playPage(pageIndex + 1);
          } else {
            setState(prev => ({ ...prev, isPlaying: false, currentPageIndex: 0 }));
          }
        };
      }

      console.log('Setting audio source and playing...');
      audioRef.current.src = audioUrl;
      await audioRef.current.play();
      console.log('Audio playing successfully');

      setState({
        isPlaying: true,
        isLoading: false,
        currentPageIndex: pageIndex,
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
      toast.error(`Failed to play audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    console.log('Resume called, checking audio ref...');
    if (audioRef.current && audioRef.current.src) {
      console.log('Audio ref has source, playing...');
      audioRef.current.play();
      setState(prev => ({ ...prev, isPlaying: true }));
    } else {
      console.log('No audio source to resume, will need to call playPage instead');
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
