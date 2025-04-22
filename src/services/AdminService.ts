import axios, { Axios } from 'axios'

export interface LicenseInfo {
  appName: string
  siteId: string
  valid: number | boolean
  createdAt: string
  expireAt: string
  key: string
  activated?: string
}

class AdminService {
  #siteId: string = ''
  appLicenseKey: string = ''
  licenseActivationUrl = ''

  #apiClient = new Axios({

    baseURL: `${import.meta.env.VITE_ADMIN_API_BASE_URL}/api`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  dashboardUrl = `${import.meta.env.VITE_ADMIN_API_BASE_URL}/dashboard`

  async init() {
    // Initialize siteId and licenseKey only once
    if (!this.#siteId) {
      const { siteId } = await webflow.getSiteInfo()
      this.#siteId = siteId
      this.appLicenseKey = btoa(siteId)

      this.licenseActivationUrl = `${
        import.meta.env.VITE_ADMIN_API_BASE_URL
      }/dashboard/popup-builder/websites?new_site=true&token=${this.appLicenseKey}`
    }
  }

  async getLicenseInfo(): Promise<LicenseInfo> {
    // Ensure that init has been called and siteId is available
    await this.init()

    if (!this.#siteId) {
      throw new Error('Site ID is missing.')
    }

    console.log('Site ID:', this.#siteId)

    const { data } = await this.#apiClient.get<LicenseInfo>(`licenses/validate`, {
      params: {
        siteId: this.#siteId,
        appName: 'popup-builder',
      },
    })

    return JSON.parse(`${data}`)
  }

  // Activate license and return the LicenseInfo
  async activateLicense(key: string): Promise<LicenseInfo | void> {
    const { siteId } = await webflow.getSiteInfo()
    this.#siteId = siteId

    const payload = {
      appName: 'popup-builder',
      siteId,
      key: key,
    }

    try {
      const responseJson = await axios.post(

        `${import.meta.env.VITE_ADMIN_API_BASE_URL}/api/licenses/activate`,
        payload,
      )
      const response = responseJson.data

      if (response.error) {
        webflow.notify({
          type: 'Error',
          message: response.error,
        })
        return
      }

      if (response.activated) {
        webflow.notify({
          type: 'Success',
          message: 'License successfully activated!',
        })
        return response
      }
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error || 'Failed to activate license.'
        : 'Failed to activate license.'

      console.error('Error activating license:', errorMessage)
      webflow.notify({
        type: 'Error',
        message: errorMessage,
      })
    }
  }

  // deactivate license and return the LicenseInfo
  async deActivateLicense(key: string): Promise<LicenseInfo | void> {
    const { siteId } = await webflow.getSiteInfo()
    this.#siteId = siteId

    const payload = {
      appName: 'popup-builder',
      siteId,
      key: key,
    }

    try {
      const responseJson = await axios.post(

        `${import.meta.env.VITE_ADMIN_API_BASE_URL}/api/licenses/deactivate`,
        payload,
      )

      const response = responseJson.data

      if (response.error) {
        webflow.notify({
          type: 'Error',
          message: response.error,
        })
        return
      }

      if (response.deactivated) {
        webflow.notify({
          type: 'Success',
          message: 'License successfully deactivated!',
        })
        return response
      }
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error || 'Failed to deactivate license.'
        : 'Failed to deactivate license.'

      console.error('Error deactivating license:', errorMessage)
      webflow.notify({
        type: 'Error',
        message: errorMessage,
      })
    }
  }
}

export default new AdminService()
