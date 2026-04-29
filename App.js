useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth event:', _event, session);
    });
  
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
  