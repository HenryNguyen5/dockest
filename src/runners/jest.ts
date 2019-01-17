import Logger from '../DockestLogger'
import ConfigurationError from '../errors/ConfigurationError'

interface IJestResult {
  results: { success: true }
}

interface IJestLib {
  SearchSource: any
  TestScheduler: any
  TestWatcher: any
  getVersion: any
  run: any
  runCLI: any
}

export interface IJestConfig {
  lib: IJestLib
  silent?: boolean
  verbose?: boolean
  forceExit?: boolean
  watchAll?: boolean
  projects: string[]
}

class JestRunner {
  public static config: IJestConfig
  private static instance: JestRunner

  constructor(config: IJestConfig) {
    if (JestRunner.instance) {
      return JestRunner.instance
    }

    this.validateJestConfig(config)
    JestRunner.config = config
  }

  public run = async () => {
    const logger = new Logger()
    const jestOptions = JestRunner.config
    const jest = JestRunner.config.lib
    let success = false

    logger.success(`Dependencies up and running, running Jest`)

    try {
      const jestResult: IJestResult = await jest.runCLI(jestOptions, jestOptions.projects)

      if (!jestResult.results.success) {
        logger.failed(`Integration test failed`)

        success = false
      } else {
        logger.success(`Integration tests passed successfully`)

        success = true
      }
    } catch (error) {
      logger.error(`Encountered Jest error`, error)

      success = false
    }

    return {
      success,
    }
  }

  private validateJestConfig = (config: IJestConfig) => {
    if (!config) {
      throw new ConfigurationError('jest config missing')
    }
  }
}

export default JestRunner
