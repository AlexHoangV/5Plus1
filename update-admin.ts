import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function updateAdmin() {
  console.log('Updating admin user password...')
  
  // First, find the user
  const { data: users, error: listError } = await supabase.auth.admin.listUsers()
  if (listError) {
    console.error('Error listing users:', listError)
    return
  }

  const adminUser = users.users.find(u => u.email === 'admin@five-plus-one.com')

    if (!adminUser) {
      console.log('Admin user not found, creating...')
      const { error: createError } = await supabase.auth.admin.createUser({
        email: 'admin@five-plus-one.com',
        password: 'osawa',
        email_confirm: true,
        user_metadata: { role: 'admin' }
      })
      if (createError) console.error('Error creating admin:', createError)
      else console.log('Admin user created.')
    } else {
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        adminUser.id,
        { password: 'osawa', email_confirm: true }
      )
      if (updateError) console.error('Error updating admin:', updateError)
      else console.log('Admin user password updated.')
    }
}

updateAdmin()
