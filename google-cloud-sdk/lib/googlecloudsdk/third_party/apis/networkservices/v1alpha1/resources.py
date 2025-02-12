# -*- coding: utf-8 -*- #
# Copyright 2015 Google LLC. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Resource definitions for cloud platform apis."""

import enum


BASE_URL = 'https://networkservices.googleapis.com/v1alpha1/'
DOCS_URL = 'https://cloud.google.com/networking'


class Collections(enum.Enum):
  """Collections for all supported apis."""

  PROJECTS = (
      'projects',
      'projects/{projectsId}',
      {},
      ['projectsId'],
      True
  )
  PROJECTS_LOCATIONS = (
      'projects.locations',
      '{+name}',
      {
          '':
              'projects/{projectsId}/locations/{locationsId}',
      },
      ['name'],
      True
  )
  PROJECTS_LOCATIONS_EDGECACHEKEYSETS = (
      'projects.locations.edgeCacheKeysets',
      '{+name}',
      {
          '':
              'projects/{projectsId}/locations/{locationsId}/'
              'edgeCacheKeysets/{edgeCacheKeysetsId}',
      },
      ['name'],
      True
  )
  PROJECTS_LOCATIONS_EDGECACHEORIGINS = (
      'projects.locations.edgeCacheOrigins',
      '{+name}',
      {
          '':
              'projects/{projectsId}/locations/{locationsId}/'
              'edgeCacheOrigins/{edgeCacheOriginsId}',
      },
      ['name'],
      True
  )
  PROJECTS_LOCATIONS_EDGECACHESERVICES = (
      'projects.locations.edgeCacheServices',
      '{+name}',
      {
          '':
              'projects/{projectsId}/locations/{locationsId}/'
              'edgeCacheServices/{edgeCacheServicesId}',
      },
      ['name'],
      True
  )
  PROJECTS_LOCATIONS_ENDPOINTPOLICIES = (
      'projects.locations.endpointPolicies',
      '{+name}',
      {
          '':
              'projects/{projectsId}/locations/{locationsId}/'
              'endpointPolicies/{endpointPoliciesId}',
      },
      ['name'],
      True
  )
  PROJECTS_LOCATIONS_GATEWAYS = (
      'projects.locations.gateways',
      '{+name}',
      {
          '':
              'projects/{projectsId}/locations/{locationsId}/gateways/'
              '{gatewaysId}',
      },
      ['name'],
      True
  )
  PROJECTS_LOCATIONS_GRPCROUTES = (
      'projects.locations.grpcRoutes',
      '{+name}',
      {
          '':
              'projects/{projectsId}/locations/{locationsId}/grpcRoutes/'
              '{grpcRoutesId}',
      },
      ['name'],
      True
  )
  PROJECTS_LOCATIONS_HTTPFILTERS = (
      'projects.locations.httpFilters',
      '{+name}',
      {
          '':
              'projects/{projectsId}/locations/{locationsId}/httpFilters/'
              '{httpFiltersId}',
      },
      ['name'],
      True
  )
  PROJECTS_LOCATIONS_HTTPROUTES = (
      'projects.locations.httpRoutes',
      '{+name}',
      {
          '':
              'projects/{projectsId}/locations/{locationsId}/httpRoutes/'
              '{httpRoutesId}',
      },
      ['name'],
      True
  )
  PROJECTS_LOCATIONS_MESHES = (
      'projects.locations.meshes',
      '{+name}',
      {
          '':
              'projects/{projectsId}/locations/{locationsId}/meshes/'
              '{meshesId}',
      },
      ['name'],
      True
  )
  PROJECTS_LOCATIONS_OBSERVABILITYPOLICIES = (
      'projects.locations.observabilityPolicies',
      '{+name}',
      {
          '':
              'projects/{projectsId}/locations/{locationsId}/'
              'observabilityPolicies/{observabilityPoliciesId}',
      },
      ['name'],
      True
  )
  PROJECTS_LOCATIONS_OPERATIONS = (
      'projects.locations.operations',
      '{+name}',
      {
          '':
              'projects/{projectsId}/locations/{locationsId}/operations/'
              '{operationsId}',
      },
      ['name'],
      True
  )
  PROJECTS_LOCATIONS_ROUTERS = (
      'projects.locations.routers',
      '{+name}',
      {
          '':
              'projects/{projectsId}/locations/{locationsId}/routers/'
              '{routersId}',
      },
      ['name'],
      True
  )
  PROJECTS_LOCATIONS_SERVICEBINDINGS = (
      'projects.locations.serviceBindings',
      '{+name}',
      {
          '':
              'projects/{projectsId}/locations/{locationsId}/serviceBindings/'
              '{serviceBindingsId}',
      },
      ['name'],
      True
  )
  PROJECTS_LOCATIONS_TCPROUTES = (
      'projects.locations.tcpRoutes',
      '{+name}',
      {
          '':
              'projects/{projectsId}/locations/{locationsId}/tcpRoutes/'
              '{tcpRoutesId}',
      },
      ['name'],
      True
  )
  PROJECTS_LOCATIONS_TLSROUTES = (
      'projects.locations.tlsRoutes',
      '{+name}',
      {
          '':
              'projects/{projectsId}/locations/{locationsId}/tlsRoutes/'
              '{tlsRoutesId}',
      },
      ['name'],
      True
  )

  def __init__(self, collection_name, path, flat_paths, params,
               enable_uri_parsing):
    self.collection_name = collection_name
    self.path = path
    self.flat_paths = flat_paths
    self.params = params
    self.enable_uri_parsing = enable_uri_parsing
