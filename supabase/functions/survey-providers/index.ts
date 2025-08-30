import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SurveyRequest {
  userId: string;
  provider: 'rapidoreach' | 'theoremreach' | 'cpx' | 'bitlabs';
  userDemographics?: {
    birthday?: string;
    gender?: string;
    country_code?: string;
    zip_code?: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, provider, userDemographics }: SurveyRequest = await req.json()

    // Get API keys from environment
    const rapidoApiKey = Deno.env.get('RAPIDOREACH_API_KEY') || 'ac9e857aa9e61eba980c0407e05688e3'
    const rapidoAppId = Deno.env.get('RAPIDOREACH_APP_ID') || 'PIufj1sh6SL'
    const cpxApiKey = Deno.env.get('CPX_RESEARCH_API_KEY') || '7782a3da8da9d1f4f0d2a9f9b9c0c611'
    const cpxAppId = Deno.env.get('CPX_RESEARCH_APP_ID') || '28886'
    const theoremApiKey = Deno.env.get('THEOREMREACH_API_KEY') || '9854ec5b04228779d58ac3e9d342'
    const bitlabsApiKey = Deno.env.get('BITLABS_API_TOKEN') || '665ef72d-bcf1-4a8d-b427-37c8b7142447'

    let surveyData: any[] = []

    switch (provider) {
      case 'rapidoreach':
        try {
          // Get user IP and city
          const ipResponse = await fetch('https://api.ipify.org?format=json')
          const ipData = await ipResponse.json()
          const userIP = ipData.ip || '127.0.0.1'

          const cityResponse = await fetch('https://ipapi.co/json/')
          const cityData = await cityResponse.json()
          const userCity = cityData.city || 'New York'

          // Map country code to language
          const countryLanguageMap: { [key: string]: string } = {
            'US': 'ENG-US',
            'CA': 'ENG-CA', 
            'GB': 'ENG-GB',
            'AU': 'ENG-AU',
            'IN': 'ENG-IN'
          }
          const countryLanguageCode = countryLanguageMap[userDemographics?.country_code || 'US'] || 'ENG-US'

          const requestBody = {
            UserId: userId,
            AppId: rapidoAppId,
            IpAddress: userIP,
            City: userCity,
            CountryLanguageCode: countryLanguageCode,
            ...(userDemographics?.birthday && { DateOfBirth: userDemographics.birthday }),
            ...(userDemographics?.gender && { 
              Gender: userDemographics.gender === 'male' ? 'M' : userDemographics.gender === 'female' ? 'F' : 'M' 
            }),
            ...(userDemographics?.zip_code && { ZipCode: userDemographics.zip_code })
          }

          const response = await fetch('https://www.rapidoreach.com/getallsurveys-api/', {
            method: 'POST',
            headers: {
              'X-RapidoReach-Api-Key': rapidoApiKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
          })

          if (response.ok) {
            surveyData = await response.json()
          }
        } catch (error) {
          console.error('RapidoReach API error:', error)
        }
        break

      case 'theoremreach':
        // TheoremReach surveys (returns estimated count)
        surveyData = Array(8).fill(null).map((_, i) => ({
          id: `theorem_${i}`,
          title: `TheoremReach Survey ${i + 1}`,
          points: 120,
          duration: '10-15 minutes'
        }))
        break

      case 'cpx':
        // CPX Research surveys (returns estimated count)
        surveyData = Array(12).fill(null).map((_, i) => ({
          id: `cpx_${i}`,
          title: `CPX Research Survey ${i + 1}`,
          points: 150,
          duration: '5-20 minutes'
        }))
        break

      case 'bitlabs':
        // BitLabs surveys (returns estimated count)
        surveyData = Array(6).fill(null).map((_, i) => ({
          id: `bitlabs_${i}`,
          title: `BitLabs Survey ${i + 1}`,
          points: 140,
          duration: '7-18 minutes'
        }))
        break

      default:
        throw new Error('Invalid provider')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        provider,
        surveys: surveyData,
        count: surveyData.length
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})