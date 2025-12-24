import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function seedAdmin() {
  console.log('Seeding admin user...')
  
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'admin@five-plus-one.com',
    password: 'osawa',
    email_confirm: true,
    user_metadata: { role: 'admin' }
  })

  if (error) {
    if (error.message.includes('already registered')) {
      console.log('Admin user already exists.')
    } else {
      console.error('Error creating admin:', error)
    }
  } else {
    console.log('Admin user created successfully:', data.user?.id)
  }
}

seedAdmin()
