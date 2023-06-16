import { CronJob } from "cron";
import { CRONDATE } from "../constants";

class Cron {
  // private jobs: CronJob[] = [];

  // private addJob = (job: CronJob) => {
  //   console.log(`[CRON] Adding job...`);
  //   this.jobs.push(job);
  // };

  // public runJobs = () => {
  //   console.log("[CRON] Running jobs...");
  //   this.jobs.forEach((job) => {
  //     job.start();
  //   });
  // };

  public runJobEveryMinute = async (httpRequest: () => Promise<void>) => {
    const job = new CronJob(CRONDATE["everyOneMinute"], async () => {
      await httpRequest();
    });

    job.start();
  };

  public runJobEveryTwoMinutes = async (httpRequest: () => Promise<void>) => {
    const job = new CronJob(CRONDATE["everyTwoMinutes"], async () => {
      await httpRequest();
    });

    job.start();
  };

  public runJobEveryDay = async (httpRequest: () => Promise<void>) => {
    const job = new CronJob(CRONDATE["daily"], async () => {
      await httpRequest();
    });

    job.start();
  };

  public runJobEveryFiveMinutes = async (httpRequest: () => Promise<void>) => {
    const job = new CronJob(CRONDATE["everyFiveMinutes"], async () => {
      await httpRequest();
    });

    job.start();
  };

  public runJobEveryFriday = async (httpRequest: () => Promise<void>) => {
    const job = new CronJob(CRONDATE["everyFriday"], async () => {
      await httpRequest();
    });

    job.start();
  };

  public runJobEveryMonth = async (httpRequest: () => Promise<void>) => {
    const job = new CronJob(CRONDATE["monthly"], async () => {
      await httpRequest();
    });

    job.start();
  };
}

export default Cron;
