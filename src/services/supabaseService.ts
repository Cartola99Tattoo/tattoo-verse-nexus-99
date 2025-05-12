import { toast } from "@/components/ui/use-toast";
import { supabase, isSupabaseConnected, warnNotConnected } from "@/integrations/supabase/client";
import { appConfig } from "@/config/appConfig";
import { getBlogService } from "./serviceFactory";
import { getProductService } from "./serviceFactory";
import { getDashboardService } from "./serviceFactory";

/**
 * Fetches blog posts from Supabase with author and category information
 * @param limit Optional number of posts to fetch
 * @returns Array of blog posts with authors and categories
 */
export async function fetchBlogPosts(limit?: number) {
  if (appConfig.dataSource.useMockData) {
    const blogService = getBlogService();
    return blogService.fetchBlogPosts(limit);
  }

  if (!isSupabaseConnected()) {
    return warnNotConnected();
  }
  
  try {
    console.log("Fetching blog posts with limit:", limit);
    const query = supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        excerpt,
        content,
        cover_image,
        published_at,
        slug,
        author_id,
        category_id,
        reading_time,
        view_count,
        tags,
        blog_categories:category_id(id, name, description),
        profiles:author_id(id, first_name, last_name, avatar_url)
      `)
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false });
    
    if (limit) {
      query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching blog posts:", error);
      throw error;
    }
    
    console.log("Blog posts fetched successfully:", data?.length || 0, "posts");
    return data || [];
  } catch (error) {
    console.error("Error in fetchBlogPosts:", error);
    toast({
      title: "Erro ao carregar artigos",
      description: "Não foi possível carregar os artigos do blog.",
      variant: "destructive"
    });
    return [];
  }
}

/**
 * Fetches blog categories from Supabase
 * @returns Array of blog categories
 */
export async function fetchBlogCategories() {
  if (appConfig.dataSource.useMockData) {
    const blogService = getBlogService();
    return blogService.fetchBlogCategories();
  }
  
  if (!isSupabaseConnected()) {
    return warnNotConnected();
  }
  
  try {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('id, name, description')
      .order('name');
    
    if (error) {
      console.error("Error fetching blog categories:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in fetchBlogCategories:", error);
    toast({
      title: "Erro ao carregar categorias",
      description: "Não foi possível carregar as categorias do blog.",
      variant: "destructive"
    });
    return [];
  }
}

/**
 * Fetches a single blog post by id or slug with author information
 * @param idOrSlug Blog post id or slug
 * @returns Blog post data or null if not found
 */
export async function fetchBlogPost(idOrSlug: string) {
  if (appConfig.dataSource.useMockData) {
    const blogService = getBlogService();
    return blogService.fetchBlogPost(idOrSlug);
  }
  
  if (!isSupabaseConnected()) {
    return warnNotConnected();
  }
  
  try {
    console.log("Fetching blog post with identifier:", idOrSlug);
    // Determinar se estamos buscando por id ou slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    
    const query = supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        content,
        excerpt,
        cover_image,
        published_at,
        slug,
        view_count,
        reading_time,
        tags,
        category_id,
        author_id,
        blog_categories:category_id(id, name, description),
        profiles:author_id(id, first_name, last_name, avatar_url)
      `);
    
    // Aplicar o filtro correto com base no identificador
    const { data, error } = await (isUuid 
      ? query.eq('id', idOrSlug) 
      : query.eq('slug', idOrSlug))
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching blog post:", error);
      throw error;
    }
    
    if (!data) {
      console.log("Blog post not found with identifier:", idOrSlug);
      return null;
    }
    
    // Incrementar view_count
    if (data.id) {
      const newViewCount = (data.view_count || 0) + 1;
      await supabase
        .from('blog_posts')
        .update({ view_count: newViewCount })
        .eq('id', data.id)
        .then(({ error }) => {
          if (error) console.warn("Failed to increment view count:", error);
        });
    }
    
    console.log("Blog post fetched successfully:", data.title);
    return data;
  } catch (error) {
    console.error("Error in fetchBlogPost:", error);
    toast({
      title: "Erro ao carregar artigo",
      description: "Não foi possível carregar o conteúdo do artigo.",
      variant: "destructive"
    });
    return null;
  }
}

/**
 * Fetches products from the store with filtering options
 * @param options Optional filtering and pagination options
 * @returns Array of products
 */
export async function fetchProducts(options?: {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  if (appConfig.dataSource.useMockData) {
    const productService = getProductService();
    return productService.fetchProducts(options);
  }
  
  if (!isSupabaseConnected()) {
    return warnNotConnected();
  }
  
  try {
    let query = supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        price,
        images,
        category,
        artist_id,
        rating,
        profiles:artist_id(first_name, last_name)
      `);
    
    // Apply filters
    if (options?.category) {
      query = query.eq('category', options.category);
    }
    
    if (options?.search) {
      query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`);
    }
    
    // Apply pagination
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in fetchProducts:", error);
    toast({
      title: "Erro ao carregar produtos",
      description: "Não foi possível carregar os produtos da loja.",
      variant: "destructive"
    });
    return [];
  }
}

/**
 * Fetches a single product by ID
 * @param id Product ID
 * @returns Product data or null if not found
 */
export async function fetchProductById(id: string | number) {
  if (appConfig.dataSource.useMockData) {
    const productService = getProductService();
    return productService.fetchProductById(id);
  }
  
  if (!isSupabaseConnected()) {
    return warnNotConnected();
  }
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        price,
        images,
        category,
        artist_id,
        rating,
        profiles:artist_id(first_name, last_name, avatar_url)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Not found error
        return null;
      }
      console.error("Error fetching product:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error in fetchProductById:", error);
    toast({
      title: "Erro ao carregar produto",
      description: "Não foi possível carregar os detalhes do produto.",
      variant: "destructive"
    });
    return null;
  }
}

/**
 * Fetches application statistics for the admin dashboard
 * @returns Dashboard statistics or null on error
 */
export async function fetchDashboardStats() {
  if (appConfig.dataSource.useMockData) {
    const dashboardService = getDashboardService();
    return dashboardService.fetchDashboardStats();
  }
  
  if (!isSupabaseConnected()) {
    return warnNotConnected();
  }
  
  try {
    // Total sales (last 30 days)
    const { data: salesData, error: salesError } = await supabase
      .from('orders')
      .select('total_amount')
      .gte('created_at', new Date(new Date().setDate(new Date().getDate() - 30)).toISOString());
    
    if (salesError) throw salesError;
    
    // New customers (last 30 days)
    const { count: newCustomers, error: customersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(new Date().setDate(new Date().getDate() - 30)).toISOString());
    
    if (customersError) throw customersError;
    
    // Pending orders
    const { count: pendingOrders, error: ordersError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
      
    if (ordersError) throw ordersError;

    // Upcoming appointments
    const { count: upcomingAppointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .gte('start_date', new Date().toISOString())
      .eq('status', 'agendado');
      
    if (appointmentsError) throw appointmentsError;

    // Blog views
    const { data: blogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .select('view_count');
      
    if (blogError) throw blogError;
    
    const totalSales = salesData?.reduce((acc, order) => acc + (order.total_amount || 0), 0) || 0;
    const blogViews = blogPosts?.reduce((acc, post) => acc + (post.view_count || 0), 0) || 0;

    return {
      totalSales,
      newCustomers: newCustomers || 0,
      pendingOrders: pendingOrders || 0,
      upcomingAppointments: upcomingAppointments || 0,
      blogViews
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    toast({
      title: "Erro ao carregar estatísticas",
      description: "Não foi possível carregar os dados do dashboard.",
      variant: "destructive"
    });
    return null;
  }
}

/**
 * Generic error handler for Supabase operations
 * @param error The error object
 * @param defaultMessage Default error message to display
 * @returns void
 */
export function handleSupabaseError(error: any, defaultMessage: string = "Ocorreu um erro na operação.") {
  console.error("Error:", error);
  
  let message = defaultMessage;
  
  // Map common error codes to user-friendly messages
  if (error.code) {
    switch (error.code) {
      case "PGRST116":
        message = "O recurso solicitado não foi encontrado.";
        break;
      case "23505":
        message = "Este registro já existe (chave duplicada).";
        break;
      case "22P02":
        message = "Formato de dados inválido.";
        break;
      case "42P01":
        message = "A tabela solicitada não existe.";
        break;
      case "42501":
        message = "Permissão negada para este recurso.";
        break;
      case "auth/email-already-in-use":
        message = "Este e-mail já está em uso.";
        break;
    }
  }
  
  toast({
    title: "Erro",
    description: message,
    variant: "destructive"
  });
}
