
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    props: (route) => ({
      propNoSettings: route.query.nosettings,
      propLocation: route.query.location,
      propWeatherUpdates: route.query.weatherupdates,
      propShowDate: route.query.showdate,
      propShowTime: route.query.showtime,
      propShowSecs: route.query.showsecs,
      propShowDescription: route.query.showdescription,
      propMinCredit: route.query.mincredit
    }),
    children: [
      { path: '', component: () => import('pages/MainPage.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
