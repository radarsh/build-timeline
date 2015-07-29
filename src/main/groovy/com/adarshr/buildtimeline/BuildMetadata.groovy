package com.adarshr.buildtimeline

import hudson.model.AbstractProject
import jenkins.model.Jenkins

class BuildMetadata {

    private AbstractProject project

    static long oldest

    BuildMetadata(AbstractProject project) {
        this.project = project
    }

    Map getData() {
        [name: name, start: start, end: end, status: status, link: link]
    }

    private long getEnd() {
        def end = project.lastBuild.result.toString().toLowerCase() == 'building' ? System.currentTimeMillis() : project.lastBuild?.startTimeInMillis + project.lastBuild?.duration

        if (start == 0) {
            end = 0
        }

        end
    }

    private long getStart() {
        def start = project.lastBuild?.startTimeInMillis

        if (start < oldest) {
            start = 0
        }

        if (oldest == 0) {
            oldest = start
        }

        start
    }

    private String getName() {
        project.name
    }

    private String getLink() {
        "${Jenkins.instance.rootUrl}${project.shortUrl}".toString()
    }

    private String getStatus() {
        project.lastBuild.result.toString().toLowerCase()
    }
}
