import { Component, Input } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { ConfigService } from '../../../common/config.service';
import { FeedService } from './feed.service';
import { Router, Routes, RouterModule } from '@angular/router';

@Component({
  selector: 'feed',
  templateUrl: './feed.html',
  styleUrls: ['./feed.scss']
})
export class Feed {
  @Input()
  private teamName: string;

  public resources: Array<Object>;

  constructor(private _feedService: FeedService, private _configService: ConfigService, private router: Router) {
  }

  ngOnInit() {
    this._loadFeed();

  }

  expandMessage(message) {
    message.expanded = !message.expanded;
  }

  private _loadFeed() {
    this.resources = [];
    this._feedService.getTeamMembers(this.teamName).subscribe((response: Response) => {
      let data = response.json();
      for (let resource of data) {
        if (resource.jobTitle == "FE" || resource.jobTitle == "Dev Lead") {
          this.resources.push({
            type: 'text-message',
            name: resource.name,
            jobTitle: " (" + resource.jobTitle + ")",
            email: resource.email,
            text: '',
            time: '',
            ago: '',
            level: resource.level,
            expanded: true,
            avatar: 'avatar',
            _id: resource._id
          });
        }
      }
    }, error => {
      console.log(JSON.stringify(error.json()));
    });
  }

  private _setCurrentResource(resource) {
    this._configService.CurrentResource = resource;
  }

  getResourceDetails(resource) {
    if (resource.jobTitle.indexOf("FE") > -1 || resource.jobTitle.indexOf("Dev Lead") > -1) {
      this._configService.Title = resource.name;
      this._setCurrentResource(resource);
      this.router.navigate(['./pages/profile']);
    }
  }
}
